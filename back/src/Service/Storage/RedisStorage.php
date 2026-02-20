<?php

namespace App\Service\Storage;

class RedisStorage implements StorageInterface
{
    private ?\Redis $redis;

    public function __construct(string $host, int $port)
    {
        $this->redis = new \Redis();
        $this->redis->connect($host, $port);
    }

    public function setValue(string $key, $value)
    {
        $this->redis->set($key, $value);
        $this->redis->save();
    }

    public function getValue(string $key)
    {
        return $this->redis->get($key);
    }

    public function updateValue(string $key, $value)
    {
        $this->redis->set($key, $value);
        $this->redis->save();
    }

    public function removeValue(string $key)
    {
        $this->redis->del($key);
        $this->redis->save();
    }

    public function removeValues(array $keys)
    {
        foreach ($keys as $key) {
            $this->removeValue($key);
        }
    }
}
