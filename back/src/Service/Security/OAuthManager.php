<?php

namespace App\Service\Security;

use App\Entity\Mobile\AccessToken;
use App\Entity\Mobile\AuthorizationCode;
use App\Entity\Mobile\Client;
use App\Entity\Mobile\RefreshToken;
use App\Entity\User;
use App\Model\OAuth\AuthorizationCodeRequest;
use App\Model\OAuth\RefreshTokenRequest;
use App\Model\OAuth\TokenRequest;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

readonly class OAuthManager
{
    public const AUTHORIZATION_CODE_EXPIRED = '+ 1 minutes';
    public const ACCESS_TOKEN_EXPIRED = '+ 1 day';
    public const REFRESH_TOKEN_EXPIRED = '+ 1 month';

    public function __construct(
        private EntityManagerInterface      $manager,
        private UserPasswordHasherInterface $passwordHasher,
        private Security $security,
    ) {
    }

    public function getAuthorizationCode(AuthorizationCodeRequest $codeRequest, Request $request): AuthorizationCode
    {
        $user = $this->manager->getRepository(User::class)->findOneBy([
            'login' => $codeRequest->getUsername()
        ]);

        if (!$user) {
            throw new BadCredentialsException('Неверный логин или пароль');
        }
        $granted = in_array("ROLE_INSPECTOR", $user->getRoles()) ||
            in_array("ROLE_MOBILE", $user->getRoles());

        //Авторизоваться может только пользователь с типами Водитель и Контроллер.
        if(!$granted) {
            throw new BadCredentialsException('Неверный логин или пароль'); //Для того, чтобы не "палить" существование аккаунта
        }

        if (!$this->passwordHasher->isPasswordValid($user, $codeRequest->getPassword())) {
            throw new BadCredentialsException('Неверный логин или пароль');
        }

        $client = $this->createClient($request, $user, $codeRequest->getDeviceId());

        $authorizationCode = new AuthorizationCode();
        $authorizationCode->setUser($user);
        $authorizationCode->setExpiredAt(new \DateTime(self::AUTHORIZATION_CODE_EXPIRED));
        $authorizationCodeToken = $this->getNewToken(64);
        $authorizationCode->setToken($authorizationCodeToken);
        $authorizationCode->setClient($client);
        $this->manager->persist($authorizationCode);
        $this->manager->flush();
        return $authorizationCode;
    }

    public function getAccessRefreshToken(TokenRequest $tokenRequest): array
    {
        $code = $tokenRequest->getAuthorizationCode();
        $code = $this->manager->getRepository(AuthorizationCode::class)->findOneBy(['token' => $code]);
        if (!$code || !$code->isValid()) {
            throw new BadCredentialsException('Неверный authorization code.');
        }

        $user = $code->getUser();
        $client = $code->getClient();

        return $this->createPairTokens($user, $client);
    }

    public function refreshCurrentToken(RefreshTokenRequest $tokenRequest): array
    {
        $refreshToken = $this->manager->getRepository(RefreshToken::class)->findOneBy(['token' => $tokenRequest->getRefreshToken()]);

        if (!$refreshToken) {
            throw new BadCredentialsException('Невалидный токен');
        }

        if ((string)$refreshToken->getClientId() !== $tokenRequest->getClientId()) {
            throw new BadCredentialsException('Невалидная пара токенов');
        }

        if (!$refreshToken->isValid()) {
            throw new BadCredentialsException('Невалидный refresh токен');
        }

        $accessToken = $refreshToken->getAccessToken();
        if ($accessToken->isValid()) {
            $accessToken->setExpiredAt(new \DateTime());
        }
        $refreshToken->setExpiredAt(new \DateTime());

        $user = $refreshToken->getUser();
        $client = $refreshToken->getClient();

        return $this->createPairTokens($user, $client);
    }

    private function createPairTokens(User $user, Client $client): array
    {
        $accessToken = $this->createAccessToken($user, $client);
        $refreshToken = $this->createRefreshToken($user, $client);
        $refreshToken->setAccessToken($accessToken);
        $this->manager->persist($accessToken);
        $this->manager->persist($refreshToken);
        $this->manager->flush();

        return [
            'accessToken' => $accessToken->getToken(),
            'accessTokenExpired' => $accessToken->getExpiredAt(),
            'refreshToken' => $refreshToken->getToken(),
            'refreshTokenExpired' => $refreshToken->getExpiredAt(),
            'clientId' => $refreshToken->getClientId()
        ];
    }

    private function createClient(Request $request, User $user, ?string $deviceId = null): Client
    {
        $client = null;
        if (null !== $deviceId) {
            $client = $this->manager->getRepository(Client::class)->findOneByDeviceId($deviceId);
        }
        if (null === $client) {
            $client = new Client();
        }
        $client->setDeviceId($deviceId);
        $client->setIp($request->getClientIp());
        $client->setUserAgent($request->headers->get('User-Agent'));
        $client->setUser($user);
        $this->manager->persist($client);
        return $client;
    }

    private function createAccessToken(User $user, Client $client): AccessToken
    {
        $accessToken = new AccessToken();
        $plainToken = $this->getNewToken(32);
        $accessToken->setToken($plainToken);
        $accessToken->setUser($user);
        $accessToken->setClient($client);
        $accessToken->setExpiredAt(new \DateTime(self::ACCESS_TOKEN_EXPIRED));
        return $accessToken;
    }

    private function createRefreshToken(User $user, Client $client): RefreshToken
    {
        $refreshToken = new RefreshToken();
        $plainToken = $this->getNewToken(32);
        $refreshToken->setToken($plainToken);
        $refreshToken->setUser($user);
        $refreshToken->setClient($client);
        $refreshToken->setExpiredAt(new \DateTime(self::REFRESH_TOKEN_EXPIRED));
        return $refreshToken;
    }

    public function getNewToken(int $length): string
    {
        return rtrim(strtr(base64_encode(random_bytes($length)), '+/', '-_'), '=');
    }
}
