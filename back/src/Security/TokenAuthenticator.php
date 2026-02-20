<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class TokenAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        protected EntityManagerInterface $entityManager,
    ) {
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('apiKey');
    }

    public function authenticate(Request $request): Passport
    {
        $token = $request->headers->get('apiKey');
        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'token' => $token,
        ]);
        if (!$user) {
            throw new AuthenticationException(
                'Invalid auth token',
                code: Response::HTTP_UNAUTHORIZED,
            );
        }
        return new SelfValidatingPassport(new UserBadge($user->getLogin()));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        throw new AuthenticationException($exception->getMessage());
    }
}
