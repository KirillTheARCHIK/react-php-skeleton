<?php

namespace App\Model\OAuth;

use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints\NotBlank;

class TokenTypeModel
{
    public const AUTHORIZATION_CODE = 'authorization_code';

    public const TOKEN = 'token';

    public const REFRESH_TOKEN = 'refresh_token';

    #[Choice(choices: [self::AUTHORIZATION_CODE, self::TOKEN, self::REFRESH_TOKEN]), NotBlank]
    private string $type;

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }
}
