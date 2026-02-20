<?php

namespace App\Controller\Administration;

use App\Service\YamlConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/administration/settings'), IsGranted('ROLE_USER')]
class SettingController extends AbstractController
{
    #[Route('/', methods: 'GET')]
    public function listAction(YamlConfigService $settingsService): Response
    {
        $configs = $settingsService->getConfig();
        return $this->json($configs);
    }

    #[Route('/', methods: 'PUT'), IsGranted("ROLE_ADMIN")]
    public function saveAction(YamlConfigService $settingsService, Request $request): Response
    {
        try {
            $content = json_decode($request->getContent(), true);
            $configs = $content;
            $settingsService->validate($configs);
            $settingsService->replaceAll($configs);

            return $this->json($configs);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{module}', methods: 'GET')]
    public function listByModuleAction(string $module, YamlConfigService $settingsService): Response
    {
        $configs = $settingsService->getConfig();

        if (!isset($configs[$module])) {
            return $this->json(['error' => 'Config module isn\'t found!'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($configs[$module]);
    }

    #[Route('/{module}', methods: 'PUT'), IsGranted("ROLE_ADMIN")]
    public function saveByModuleAction(string $module, YamlConfigService $settingsService, Request $request): Response
    {
        try {
            $configs = $settingsService->getConfig();

            if (!isset($configs[$module])) {
                return $this->json(['error' => 'Config module isn\'t found!'], Response::HTTP_NOT_FOUND);
            }

            $content = json_decode($request->getContent(), true);
            $configs[$module] = $content;
            $settingsService->validate($configs);
            $settingsService->replaceAll($configs);

            return $this->json($configs[$module]);
        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
