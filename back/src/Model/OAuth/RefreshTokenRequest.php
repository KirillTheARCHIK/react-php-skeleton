<?php

namespace App\Model\OAuth;

use Symfony\Component\Validator\Constraints\NotBlank;

class RefreshTokenRequest
{
    #[NotBlank]
    private string $refreshToken;

    #[NotBlank]
    private string $clientId;

    /**
     * @return string
     */
    public function getRefreshToken(): string
    {
        return $this->refreshToken;
    }

    /**
     * @param string $refreshToken
     */
    public function setRefreshToken(string $refreshToken): void
    {
        $this->refreshToken = $refreshToken;
    }

    /**
     * @return string
     */
    public function getClientId(): string
    {
        return $this->clientId;
    }

    /**
     * @param string $clientId
     */
    public function setClientId(string $clientId): void
    {
        $this->clientId = $clientId;
    }
}
