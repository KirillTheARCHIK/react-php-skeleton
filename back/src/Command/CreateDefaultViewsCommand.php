<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[AsCommand("app:views:create")]
class CreateDefaultViewsCommand extends Command
{
    private Connection $connection;
    private string $projectDir;
    private \SplQueue $creationQueue;
    private array $createdViews = [];
    private array $inQueueViews = [];

    public function __construct(
        Connection $connection,
        #[Autowire('%kernel.project_dir%')]
        string     $projectDir
    ) {
        $this->connection = $connection;
        $this->projectDir = $projectDir;
        $this->creationQueue = new \SplQueue();
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $viewsDir = sprintf('%s/postgresql/View/', $this->projectDir);

            $this->dropExistingViews();
            $this->createViewsFromDir($viewsDir, $output);
            $this->createViewsFromQueue($output);

            $output->writeln('Созданы все представления!');
        } catch (\Exception $exception) {
            $output->writeln("Ошибка создания представлений: " . $exception->getMessage());
            return Command::FAILURE;
        }

        return 0;
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function dropExistingViews(): void
    {
        $schemaManager = $this->connection->createSchemaManager();
        $views = $schemaManager->listViews();
        foreach ($views as $view) {
            $viewName = $view->getName();
            if (preg_match('/public.view_[a-z_]+/', $viewName)) {
                $this->connection->executeQuery(sprintf('DROP VIEW IF EXISTS %s CASCADE', $viewName));
            }
        }
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function createView(string $script, string $fileName, OutputInterface $output, bool $queue = false): void
    {
        preg_match('/CREATE VIEW\s+([a-z_]+)/', $script, $matches);
        if (!isset($matches[1])) {
            return;
        }
        $viewName = $matches[1];

        preg_match_all('/JOIN\s+(view_[a-z_]+)/', $script, $matchedJoins);
        $dependencies = $matchedJoins[1] ?? [];
        foreach ($dependencies as $dependency) {
            // Если в момент очереди зависимость ранее не встречалась, она пропускается
            if ($queue && !isset($this->createdViews[$dependency]) && !isset($this->inQueueViews[$dependency])) {
                continue;
            }

            // Если зависимость не создана, файл помещается в очередь
            if (!isset($this->createdViews[$dependency])) {
                $this->creationQueue->push($fileName);
                $this->inQueueViews[$viewName] = true;
                return;
            }
        }

        try {
            // Удаление таблиц, которые создаются при автогенерации бд
            $this->connection->executeQuery(sprintf('DROP TABLE IF EXISTS %s CASCADE', $viewName));

            $this->connection->executeQuery($script);
            $this->createdViews[$viewName] = true;
            $output->writeln($fileName . ' was executed.');
        } catch (Exception $exception) {
            throw new Exception(
                sprintf('%s: %s', $viewName, $exception->getMessage()),
                $exception->getCode(),
                $exception->getPrevious()
            );
        }
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function createViewsFromDir(string $viewsDir, OutputInterface $output): void
    {
        $fileNames = scandir($viewsDir);
        foreach ($fileNames as $fileName) {
            $fullPath = $viewsDir . $fileName;
            if (preg_match("/\.sql$/", $fileName)) {
                $script = file_get_contents($fullPath);
                $this->createView($script, $fullPath, $output);
            } elseif (!in_array($fileName, ['.', '..']) && is_dir($fullPath)) {
                $this->createViewsFromDir($fullPath . '/', $output);
            }
        }
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function createViewsFromQueue(OutputInterface $output): void
    {
        foreach ($this->creationQueue as $fileName) {
            $script = file_get_contents($fileName);
            $this->createView($script, $fileName, $output, true);
        }
    }
}
