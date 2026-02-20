<?php

namespace App\Service\Security;

use App\Attribute\ExportEntity;
use App\Controller\Builder\CustomNamedControllerInterface;
use App\Controller\Builder\ExternalSystemLinkControllerInterface;
use App\Service\Utility\AttributeHelper;
use App\Service\Utility\EntityHelper;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

readonly class RoleManager
{
    public function __construct(
        private RouterInterface $router,
        private Security        $security,
    ) {
    }

    public function getAvailableRolesByCurrentUser(): array
    {
        $controllers = $this->getAllAppControllers();
        $rolesMap = [];
        foreach ($controllers as $controller) {
            $name = $this->getReadableNameByControllerClass($controller);
            if (!$name) {
                continue;
            }

            $roles = array_filter(
                $this->extractRolesFromController($controller),
                fn ($item) => $this->security->isGranted($item)
            );

            if (count($roles) === 0) {
                continue;
            }

            $rolesMap[] = $this->getRoleObject($roles, $controller, $name);
        }
        return $rolesMap;
    }

    public function getAllRoles(): array
    {
        $controllers = $this->getAllAppControllers();
        $rolesMap = [];
        foreach ($controllers as $controller) {
            $name = $this->getReadableNameByControllerClass($controller);
            if (!$name) {
                continue;
            }

            $roles = $this->extractRolesFromController($controller);

            if (count($roles) === 0) {
                continue;
            }

            $rolesMap[] = $this->getRoleObject($roles, $controller, $name);
        }
        return $rolesMap;
    }

    private function getRoleObject(array $roles, $controller, $name): array
    {
        $entityName = $this->extractName($controller);

        $roleObject = [
            'name' => $name,
            'key' => EntityHelper::getEntitySlug(new \ReflectionClass($entityName)),
            'controller' => $controller,
            'roles' => array_values($roles),
        ];
        if (in_array(ExternalSystemLinkControllerInterface::class, class_implements($controller), true)) {
            $roleObject['targetBlank'] = true;
            $roleObject['url'] = $controller::getRedirectURL();
        }

        return $roleObject;
    }

    private function getReadableNameByControllerClass(string $controller): ?string
    {
        $classImplements = class_implements($controller);
        if (in_array(CustomNamedControllerInterface::class, $classImplements, true)
            || in_array(ExternalSystemLinkControllerInterface::class, $classImplements, true)
        ) {
            $method = new \ReflectionMethod($controller, 'getCustomName');
            return $method->invoke(null);
        }

        $entityClass = $this->extractName($controller);
        if (!$entityClass) {
            return $entityClass;
        }

        $refClass = new \ReflectionClass($entityClass);
        $annotation = AttributeHelper::getAttribute($refClass, ExportEntity::class);
        if (!$annotation) {
            return null;
        }

        return $annotation->title;
    }

    public function extractName(string $controller): ?string
    {
        $classImplements = class_implements($controller);
        if (in_array(CustomNamedControllerInterface::class, $classImplements, true)
            || in_array(ExternalSystemLinkControllerInterface::class, $classImplements, true)
        ) {
            return $controller;
        }

        $methodName = 'getEntityName';
        if (!method_exists($controller, $methodName)) {
            return null;
        }
        $method = new \ReflectionMethod($controller, $methodName);
        if (!$method->isStatic()) {
            return null;
        }
        return $method->invoke(null);
    }

    private function extractRolesFromController(string $controller): array
    {
        $reflectionClass = new \ReflectionClass($controller);
        $attributes = $reflectionClass->getAttributes(IsGranted::class);
        $roles = $this->getRolesByAttributeArray($attributes);
        $methods = $reflectionClass->getMethods();
        $methodRoles = $this->getRolesByMethodArray($methods);
        //need merge, unique and restore keys for two arrays
        return array_values(array_unique(array_merge($methodRoles, $roles)));
    }

    private function getRolesByAttributeArray(array $attributes): array
    {
        return array_map(fn ($item) => $item->getArguments()[0], $attributes);
    }

    private function getRolesByMethodArray(array $methods): array
    {
        $allRoles = [];
        /**
         * @var \ReflectionMethod $method
         */
        foreach ($methods as $method) {
            $attributes = $method->getAttributes(IsGranted::class);
            if ($attributes) {
                $roles = $this->getRolesByAttributeArray($attributes);
                $allRoles = array_merge($allRoles, $roles);
            }
        }
        return $allRoles;
    }

    public function getAllAppControllers(): array
    {
        //Getting all routers
        $controllers = $this->router->getRouteCollection();
        //get all methods and substr controller class name
        $controllers = array_map(function ($item) {
            $controller = $item->getDefault('_controller');
            return substr($controller, 0, strpos($controller, '::'));
        }, $controllers->all());
        //cast to array and remove keys
        $controllers = (array)array_values($controllers);
        //unique controller names
        $controllers = array_unique($controllers);
        //remove non-app controller names
        $controllers = array_filter($controllers, function ($item) {
            return str_contains($item, 'App\Controller');
        });
        //restore keys
        return array_values((array)$controllers);
    }
}
