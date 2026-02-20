<?php

namespace App\Controller;

use App\Entity\User;
use App\Serializer\RelationNormalizer;
use App\Serializer\UserNormalizer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/v1')]
class ProfileController extends AbstractController
{
    protected function getDefaultNormalizerContext(): array
    {
        return [
            AbstractNormalizer::GROUPS => ['View'],
            UserNormalizer::COLLAPSE => true,
            RelationNormalizer::RELATION_NORMALIZER => [
            ]
        ];
    }

    protected function getDefaultEditContext($entity): array
    {
        return [
            AbstractNormalizer::OBJECT_TO_POPULATE => $entity,
            AbstractNormalizer::GROUPS => ['ProfileEdit'],
        ];
    }

    protected function getCustomerEditContext($entity): array
    {
        return [
            AbstractNormalizer::OBJECT_TO_POPULATE => $entity,
            AbstractNormalizer::GROUPS => ['CustomerEdit'],
        ];
    }

    #[Route('/profile', methods: 'PUT')]
    public function profileAction(Request $request, SerializerInterface $serializer, ValidatorInterface $validator, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        try {
            $entity = $serializer->deserialize(
                $request->getContent(),
                User::class,
                'json',
                $this->getDefaultEditContext($user)
            );

            return $this->validateAndFlushEntity($entity, $validator, $em);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    protected function validateAndFlushEntity($entity, ValidatorInterface $validator, EntityManagerInterface $em): Response
    {
        $errors = $validator->validate($entity);
        if ($errors->count() > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }
        $em->persist($entity);
        $em->flush();

        return $this->json(
            $entity,
            Response::HTTP_OK,
            [],
            $this->getDefaultNormalizerContext()
        );
    }
}
