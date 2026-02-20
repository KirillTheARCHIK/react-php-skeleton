<?php

namespace App\Model\OAuth;

use Symfony\Component\Validator\Constraints\NotBlank;

class TokenRequest
{
    #[NotBlank]
    private string $authorizationCode;

    /**
     * @return string
     */
    public function getAuthorizationCode(): string
    {
        return $this->authorizationCode;
    }

    /**
     * @param string $authorizationCode
     */
    public function setAuthorizationCode(string $authorizationCode): void
    {
        $this->authorizationCode = $authorizationCode;
    }

}
