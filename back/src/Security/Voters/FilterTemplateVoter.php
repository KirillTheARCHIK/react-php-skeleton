<?php

namespace App\Security\Voters;

use App\Entity\FilterTemplate;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;

class FilterTemplateVoter extends Voter
{
    public const SHOW = 'FILTER_TEMPLATE_VIEW';
    public const EDIT = 'FILTER_TEMPLATE_EDIT';
    public const DELETE = 'FILTER_TEMPLATE_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if (!in_array($attribute, [self::SHOW, self::EDIT, self::DELETE], true)) {
            return false;
        }

        if (!$subject instanceof FilterTemplate) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        /** @var FilterTemplate $filter */
        $filter = $subject;

        $user = $token->getUser();
        if (!$user instanceof User) {
            $user = null;
        }

        return match($attribute) {
            self::SHOW => $this->canView($filter, $user),
            self::EDIT, self::DELETE => $this->canModify($filter, $user),
            default => throw new \LogicException('This code should not be reached!')
        };
    }

    protected function canModify(FilterTemplate $entity, ?User $user): bool
    {
        return $entity->getAuthor() === $user || $entity->getAuthor() === null;
    }

    protected function canView(FilterTemplate $entity, ?User $user): bool
    {
        return $this->canModify($entity, $user) || $entity->isPublic();
    }
}
