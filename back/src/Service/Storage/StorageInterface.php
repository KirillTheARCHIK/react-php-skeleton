<?php

namespace App\Service\Storage;

interface StorageInterface
{
    public function setValue(string $key, $value);

    public function getValue(string $key);

    public function updateValue(string $key, $value);

    public function removeValue(string $key);

    public function removeValues(array $keys);
}
