<?php

namespace App\Service;

use App\Entity\Accident;
use App\Entity\AccidentFile;
use App\Entity\DriverFile;
use App\Entity\File;
use App\Entity\Integration\Driver;
use App\Entity\Integration\Vehicle;
use App\Entity\RepairNote;
use App\Entity\RepairNoteFile;
use App\Entity\TrafficViolation;
use App\Entity\VehicleFile;
use App\Entity\ViolationFile;
use App\Service\Utility\PathHelper;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Gedmo\Uploadable\FilenameGenerator\FilenameGeneratorSha1;
use Stof\DoctrineExtensionsBundle\Uploadable\UploadableManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class FileService
{
    public static array $mapping = [
        Accident::class => [
            'fileEntity' => AccidentFile::class,
        ],
        TrafficViolation::class => [
            'fileEntity' => ViolationFile::class,
        ],
        Driver::class => [
            'fileEntity' => DriverFile::class,
        ],
        Vehicle::class => [
            'fileEntity' => VehicleFile::class,
        ],
        RepairNote::class => [
            'fileEntity' => RepairNoteFile::class,
        ],
    ];

    public function __construct(
        protected EntityManagerInterface $em,
        protected UploadableManager $um,
        #[Autowire('%kernel.project_dir%')] private readonly string $projectDir,
        protected UrlGeneratorInterface $urlGenerator
    ) {
        $this->em = $em;
        $this->um = $um;
    }

    /**
     * @param Request $request
     * @return ArrayCollection
     */
    public function validateRequest(Request $request): ArrayCollection
    {
        $errors = [];

        if (0 == $request->files->count()) {
            $errors[] = ['files' => 'No Files found'];
        }

        if ($request->get('originalName') && !is_string($request->get('originalName'))) {
            $errors[] = ['originalName' => 'Field originalName must be string'];
        }

        return new ArrayCollection($errors);
    }

    /**
     * @param string $entityClass
     * @param int $id
     *
     * @return object|null
     */
    private function getOwnerEntityFromRequest(string $entityClass, int $id): ?object
    {
        return $this->em->find($entityClass, $id);
    }

    /**
     * @param string $className
     *
     * @return mixed
     */
    public static function createFileEntityFromSlug(string $className): mixed
    {
        return new FileService::$mapping[$className]['fileEntity']();
    }

    public function makeFromRequest(Request $request, $id, $entityClass): ArrayCollection
    {
        $files = new ArrayCollection($request->files->all());
        $owner = $this->getOwnerEntityFromRequest($entityClass, $id);

        $files = $files->map(function ($file) use ($owner, $request, $entityClass) {
            return $this->makeFile($owner, $file, $request, $entityClass);
        });

        $this->em->flush();

        return $files;
    }

    public function makeFile($owner, UploadedFile $file, $request, $entityClass)
    {
        $fileEntity = self::createFileEntityFromSlug($entityClass);
        $fileEntity->setOriginalName($file->getClientOriginalName());
        $fileEntity->setOwner($owner);
        if ($request->get('originalName')) {
            $fileEntity->setOriginalName($request->get('originalName'));
        }

        $originalName = $file->getClientOriginalName();
        $path = PathHelper::getPublicDir($this->projectDir). DIRECTORY_SEPARATOR . $fileEntity->getUploadableDirPath();

        $filename = FilenameGeneratorSha1::generate(
            $file->getFilename(),
            '.' .PathHelper::getFileExtensionFromPath($originalName),
            $file
        );
        $target = $file->move($path, $filename);
        $fileDist = new UploadedFile($target->getFileInfo()->getPathName(), $originalName, $target->getMimeType());
        $fileEntity->setFile($fileDist);
        $fileEntity->setPath($fileEntity->getUploadableDirPath() . DIRECTORY_SEPARATOR . $target->getFilename());
        $fileEntity->setSize($fileDist->getSize());

        $this->em->persist($fileEntity);
        $fileEntity->setDownloadUrl($this->generateDownloadUrl($fileEntity));

        return $fileEntity;
    }

    /**
     * @param int $id
     * @param string $entityClass
     *
     * @return mixed
     */
    public function findByOwner(int $id, string $entityClass): mixed
    {
        $owner = $this->em->find($entityClass, $id);

        $files = $owner->getFiles();

        return $files;
    }

    /**
     * @param int $id
     *
     * @return File
     */
    public function removeFile(int $id): File
    {
        $entity = $this->em->find(File::class, $id);

        $this->em->remove($entity);
        $this->em->flush();

        return $entity;
    }

    public function generateDownloadUrl(File $file): string
    {
        return $this->urlGenerator->generate('download_file', ['id' => $file->getId()]);
    }
}
