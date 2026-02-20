<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamedResponseService
{
    public function getStreamResponse(callable $callback): ?StreamedResponse
    {
        // Removing execution time limit
        ini_set('max_execution_time', 0);
        ignore_user_abort(false);

        // Saving session for provide access to read another processes
        session_write_close();
        $headers = [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
            'Access-Control-Allow-Origin' => '*',
            'X-Accel-Buffering' => 'no',
        ];

        return new StreamedResponse($callback, Response::HTTP_OK, $headers);
    }
}
