<?php

namespace App\Controller\Builder;

use App\Entity\File;
use App\Filter\SoftDeleteableFilter;
use App\Service\FileService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

trait HasFilesMethods
{
    public function showFiles(int $id, FileService $fileService): Response
    {
        $filters = $this->managerRegistry->getManager()->getFilters();
        /** @var SoftDeleteableFilter $filter */
        $filter = $filters->getFilter('softdeleteable');
        $filter->addEnabled(File::class);
        $files = $fileService->findByOwner($id, static::getEntityName());

        return $this->json($files, Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => ['View'],
        ]);
    }

    public function createFiles(int $id, Request $request, FileService $fileService): Response
    {
        $errors = $fileService->validateRequest($request);
        if ($errors->count() > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }

        $files = $fileService->makeFromRequest($request, $id, self::getEntityName());

        return $this->json($files->toArray(), Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => ['View'],
        ]);
    }

    public function deleteFiles($id, FileService $fileService): Response
    {
        try {
            $entity = $fileService->removeFile($id);

            return $this->json($entity, Response::HTTP_OK, [], $this->getDefaultNormalizerContext());
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function editFiles(File $entity, Request $request): Response
    {
        try {
            $entity = $this->serializer->deserialize($request->getContent(), File::class, 'json', [
                AbstractNormalizer::OBJECT_TO_POPULATE => $entity,
                AbstractNormalizer::GROUPS => ['CreateOrEdit'],
            ]);

            $errors = $this->validator->validate($entity);
            if ($errors->count() > 0) {
                return $this->json($errors, Response::HTTP_BAD_REQUEST);
            }
            $em = $this->managerRegistry->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->json($entity, Response::HTTP_OK, [], [
                AbstractNormalizer::GROUPS => ['View'],
            ]);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
