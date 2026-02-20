<?php

namespace App\Command;

use App\Service\Utility\AttributeHelper;
use App\Attribute\ExportColumn;
use App\Attribute\ExportEntity;
use App\Entity\User;
use App\Serializer\DoctrineDenormalizer;
use App\Serializer\ModelIdNormalizer;
use App\Service\Entity\DataService;
use App\Service\Security\RoleManager;
use Doctrine\ORM\Mapping\Column;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[AsCommand(name: "app:api:generate")]
class APIGeneratorCommand extends Command
{
    public const CUSTOM_ROUTES = [
        [
            "name" => "Карточки ЗВР",
            "key" => "repair_application",
        ],
        [
            "name" => "Резервы ремонта",
            "key" => "repair_reserves",
        ],
        [
            "name" => "Данные по обучению водителей",
            "key" => "driver_study_data",
        ],
        [
            "name" => "Подразделения ТОиР",
            "key" => "repair_subdivision",
        ],
        [
            "name" => "Заявки на перевозку",
            "key" => "transportation_application",
        ],
        [
            "name" => "Запросы на перевозку",
            "key" => "transportation_request",
        ],
        [
            "name" => "ТС (ТОиР)",
            "key" => "repair_vehicle",
        ],
        [
            "name" => "История ремонта (ТОиР)",
            "key" => "repair_log",
        ],
        [
            "name" => "Динамический график перевозок (ДГП)",
            "key" => "dynamic_transportation_schedule",
        ],
        [
            "name" => "Предварительные результаты просчета показателей",
            "key" => "calculation_result_indicator",
        ],
        [
            "name" => "Предварительные результаты просчета показателей РРПО",
            "key" => "calculation_result_indicator_rrpo",
        ],
        [
            "name" => "Маршрутные точки запроса",
            "key" => "transportation_point",
        ]
    ];

    public const INDEX_MD_HEADER = "# RITM3 External APIDoc\n___\n";
    public const INDEX_MD_FILENAME = "INDEX.md";

    private array $exceptionControllers = [];

    public function __construct(
        private readonly RoleManager                                $roleManager,
        private readonly DataService                                $dataService,
        private readonly SerializerInterface                        $serializer,
        #[Autowire('%kernel.project_dir%')] private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    private function getDescriptionFromPHPDoc(string $phpDoc): ?string
    {
        $atSymbol = strpos($phpDoc, '@');
        if (false !== $atSymbol) {
            $phpDoc = substr($phpDoc, 0, $atSymbol);
        }

        $phpDoc = str_replace("\n", " ", $phpDoc);

        if (false !== preg_match("/^\/\*\*\s[*\s]+$/", $phpDoc)) {
            $phpDoc = preg_replace('/\/\*\*\s[*\s]+/', "", $phpDoc);
            $phpDoc = !empty($phpDoc) ? $phpDoc : null;
        }
        return $phpDoc;
    }

    /**
     * @throws \ReflectionException
     */
    public function writeFieldsDescription(string $entityName, array $groups, OutputInterface $output, string $template): string
    {
        $entityRef = new \ReflectionClass($entityName);
        $entityProperties = $entityRef->getProperties();
        foreach ($entityProperties as $property) {
            $output->writeln("Обработка поля " . $property->getName());
            /** @var ?Groups */
            $groupsAttribute = AttributeHelper::getAttribute($property, Groups::class);
            if (null == $groupsAttribute) {
                $output->writeln("Аннотация не найдена, пропущено");
                continue;
            }

            $diff = array_diff($groupsAttribute->groups, $groups);

            if ($diff === $groups) {
                $output->writeln("Группа не найдена, пропущено");
                continue;
            }

            $description = $property->getDocComment();
            $description = $this->getDescriptionFromPHPDoc($description);

            $doctrineAnnotation = AttributeHelper::getAttribute($property, Column::class);
            $doctrineComment = null;

            if (null !== $doctrineAnnotation) {
                $output->writeln("Аннотация @ORM\Column найдена");
                if (isset($doctrineAnnotation->options['comment'])) {
                    $doctrineComment = $doctrineAnnotation->options['comment'];
                }
            }

            $exportAnnotation = AttributeHelper::getAttribute($property, ExportColumn::class);
            $exportAnnotationTitle = null;

            $exportAnnotationTitle = $exportAnnotation?->title;


            $output->writeln("Поле добавлено в выборку");
            $template .= sprintf(
                "|%s|%s|%s|\n",
                $property->getName(),
                $this->translateType($property->getType()),
                $exportAnnotationTitle ?? $doctrineComment ?? $this->getEntityDescriptionFromType($property->getType()) ?? $description
            );
        }

        $entityMethods = $entityRef->getMethods();
        foreach ($entityMethods as $method) {
            $output->writeln("Обработка метода " . $method->getName());
            $groupsAnnotation = AttributeHelper::getAttribute($method, Groups::class);

            if (null === $groupsAnnotation) {
                $output->writeln("Аннотация не найдена, пропущено");
                continue;
            }

            $diff = array_diff($groupsAnnotation->groups, $groups);

            if ($diff === $groups) {
                $output->writeln("Группа не найдена, пропущено");
                continue;
            }

            $description = $method->getDocComment();
            $description = $this->getDescriptionFromPHPDoc($description);
            $methodName = $method->getName();
            $prefLength = 3;

            if (str_starts_with($methodName, "is")) {
                $prefLength = 2;
            }


            $template .= sprintf(
                "|%s|%s|%s|\n",
                lcfirst(substr($methodName, $prefLength, strlen($methodName) - $prefLength)),
                $this->translateType($method->getReturnType()?->getName()),
                $description
            );
        }


        return $template;
    }

    /**
     * @throws \ReflectionException
     */
    private function getEntityDescriptionFromType(?string $type): ?string
    {
        if (!$type) {
            return null;
        }

        if (!str_contains($type, "App\Entity")) {
            return null;
        }

        $entityType = $type;

        if (str_contains($entityType, "?")) {
            $entityType = substr($entityType, 1, strlen($entityType) - 1);
        }

        $entityRef = new \ReflectionClass($entityType);
        $exportAnnotation = AttributeHelper::getAttribute($entityRef, ExportEntity::class);

        if (!$exportAnnotation) {
            return null;
        }

        return $exportAnnotation->title;
    }

    private function translateType(?string $originalType): string
    {
        if (!$originalType) {
            return "Не описано";
        }

        if (str_contains($originalType, "App\Entity")) {
            return "int";
        }

        if (str_contains($originalType, "Doctrine\Common\Collections")) {
            return "array<int>";
        }

        return $originalType;
    }

    /**
     * @param mixed $object
     * @param false|string $template
     * @param mixed $response
     * @return array|string|string[]
     */
    public function prepareTemplate(mixed $object, false|string $template, mixed $response): string|array
    {
        $template = str_replace('{TITLE}', $object['name'], $template);
        $template = str_replace('{SUBTITLE}', $object['key'], $template);
        $template = str_replace('{METHOD}', "GET", $template);
        $template = str_replace('{URL}', "/api/v1/external/data/" . $object['key'], $template);
        return str_replace(
            '{CODE}',
            json_encode(json_decode($response), JSON_PRETTY_PRINT),
            $template
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $roleMap = array_merge($this->roleManager->getAllRoles(), self::CUSTOM_ROUTES);
        $request = Request::createFromGlobals();

        $indexFilePath = sprintf(
            "%s/../docs/%s",
            $this->projectDir,
            self::INDEX_MD_FILENAME
        );

        if (file_exists($indexFilePath)) {
            unlink($indexFilePath);
        }

        file_put_contents($indexFilePath, self::INDEX_MD_HEADER);

        $output->writeln(sprintf("ДОСТУПНЫЕ СПРАВОЧНИКИ (%s):", count($roleMap)));
        array_map(function ($object) use ($output, $request, $indexFilePath) {
            $output->writeln($object['name']);

            try {
                $data = $this->dataService->getData($object['key'], $request, false);
                $entityName = $data['entityName'];
                $data = $data['rows'];

                $response = $this->serializer->serialize($data, format: 'json', context: [
                    AbstractNormalizer::GROUPS => ['View'],
                    ModelIdNormalizer::PARENT_CLASS => $entityName,
                    DoctrineDenormalizer::DOCTRINE_MAPPING => [
                        User::class => true,
                    ]
                ]);

                $filename = sprintf("%s.md", $object['key']);
                $apiPagePath = sprintf("%s/../docs/%s", $this->projectDir, $filename);


                if (file_exists($apiPagePath)) {
                    unlink($apiPagePath);
                }


                $template = file_get_contents(sprintf("%s/../docs/api_page_template.md", $this->projectDir));

                $template = $this->prepareTemplate($object, $template, $response);

                $template .= "\n ## Описание полей\n";
                $template .= "|Наименование поля|Тип данных|Описание поля|\n|---|---|---|\n";

                $template = $this->writeFieldsDescription($entityName, ["View"], $output, $template);

                file_put_contents($apiPagePath, $template);
                file_put_contents($indexFilePath, sprintf(
                    " - [%s (%s)](%s)\n",
                    $object['name'],
                    $object['key'],
                    $filename
                ), FILE_APPEND);

                $output->writeln("Requested!");
            } catch (\Exception $exception) {
                $this->exceptionControllers[] = [
                    'name' => $object['name'],
                    'exception' => $exception->getMessage()
                ];
            }
        }, $roleMap);


        $output->writeln('ОШИБКИ В');
        array_map(fn ($item) => $output->writeln($item['name'] . ":" . $item['exception']), $this->exceptionControllers);


        return Command::SUCCESS;
    }
}
