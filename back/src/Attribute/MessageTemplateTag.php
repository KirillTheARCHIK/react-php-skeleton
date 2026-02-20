<?php

namespace App\Attribute;

#[\Attribute]
class MessageTemplateTag
{
    public const ANNOTATION = 'TemplateMessageTag';

    public function __construct(
        public string $tag,
        public string $title,
    ) {
    }

    public function asArray(): array
    {
        return [
            'tag' => $this->tag,
            'name' => $this->title,
        ];
    }
}
