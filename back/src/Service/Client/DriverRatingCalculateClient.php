<?php

namespace App\Service\Client;

use App\Entity\Integration\Waybill;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DriverRatingCalculateClient
{
    public function __construct(
        private HttpClientInterface $driverRatingCalcClient,
    ) {
    }

    public function calculateRatingByWaybill(Waybill $waybill): void
    {
        $this->driverRatingCalcClient->request('POST', '/api/mew/rating_per_shift', [
            'json' => ['previous' => false, 'waybill_id' => $waybill->getId()]
        ]);
    }
}
