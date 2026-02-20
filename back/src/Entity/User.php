<?php

namespace App\Entity;

use App\Attribute\ExportEntity;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\SoftDeleteable\Traits\SoftDeleteableEntity;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\DBAL\Types\Types;

#[ExportEntity("Пользователи")]
#[ORM\Table("users")]
#[ORM\Entity(UserRepository::class)]
#[UniqueEntity(["login"], "Введенный логин уже используется другим пользователем", repositoryMethod: "checkUniqueLogin")]
#[ORM\HasLifecycleCallbacks()]
#[Gedmo\SoftDeleteable()]
#[Gedmo\Loggable(logEntryClass: UserEvent::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    use SoftDeleteableEntity;
    use HasDisplayName;

    /** Идентификатор */
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    #[ORM\Column(type: Types::INTEGER, options: ["comment" => "Идентификатор"])]
    #[Groups(["View", "List"])]
    private ?int $id = null;

    /** Уникальный логин */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Уникальный логин"])]
    private ?string $loginLc = null;

    /** Логин */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Логин"])]
    #[Groups(["View", "Create", "Edit"])]
    #[Assert\NotBlank(groups: ["Create", "Edit"])]
    private ?string $login = null;

    /** Фамилия */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Фамилия"])]
    #[Groups(["View", "Create", "Edit", "ProfileEdit"])]
    #[Assert\NotBlank(groups: ["Create", "Edit", "ProfileEdit"])]
    private ?string $lastName = null;

    /** Имя */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Имя"])]
    #[Groups(["View", "Create", "Edit", "ProfileEdit"])]
    #[Assert\NotBlank(groups: ["Create", "Edit", "ProfileEdit"])]
    private ?string $firstName = null;

    /** Отчество */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Отчество"])]
    #[Groups(["View", "Create", "Edit", "ProfileEdit"])]
    #[Assert\NotBlank(groups: ["Create", "Edit", "ProfileEdit"])]
    private ?string $patronymic = null;

    /** Хешированный пароль */
    #[ORM\Column(type: Types::STRING, options: ["comment" => "Хешированный пароль"])]
    private ?string $password = '';

    /** Роли */
    #[ORM\Column(type: Types::SIMPLE_ARRAY, options: ["comment" => "Роли"])]
    #[Groups(["View", "Create", "Edit"])]
    private array $roles;

    /** Пароль */
    #[Groups(["Interaction", "Edit"])]
    #[Assert\Regex("/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/", "Пароль должен содержать буквы разных регистров и цифры.")]
    #[Assert\Regex("/^(?:(.)(?!\1))*$/", "Пароль не должен содержать последовательных повторяющихся символов.")]
    private ?string $plainPassword = null;

    /** Токен */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Токен"])]
    private ?string $token;

    /** Почта */
    #[ORM\Column(type: Types::STRING, nullable: true, options: ["comment" => "Почта"])]
    #[Groups(["View", "Create", "Edit", "ProfileEdit"])]
    #[Assert\NotBlank(groups: ["Create", "Edit", "ProfileEdit"])]
    #[Assert\Email()]
    private ?string $email = null;

    /** Дата приема */
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true, options: ["comment" => "Дата приема"])]
    #[Groups(["View", "Create", "Edit", "ProfileEdit"])]
    protected ?\DateTime $employmentDate;

    /** Дата увольнения */
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true, options: ["comment" => "Дата увольнения"])]
    #[Groups(["View", "Create", "Edit", "ProfileEdit"])]
    protected ?\DateTime $dismissalDate;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string)$this->login;
    }

    public function setUsername(string $login)
    {
        $this->login = $login;
        $this->loginLc = strtolower($login);

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): ?string
    {
        return (string)$this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName($lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getPatronymic(): ?string
    {
        return $this->patronymic;
    }

    public function setPatronymic(?string $patronymic): self
    {
        $this->patronymic = $patronymic;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    /**
     * @return mixed
     */
    public function getLogin()
    {
        return $this->login;
    }

    /**
     * @param mixed $login
     */
    public function setLogin($login)
    {
        $this->login = $login;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function prepare()
    {
        $this->loginLc = strtolower($this->login);
    }

    /**
     * @return ?string
     */
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    /**
     * @param ?string $plainPassword
     */
    public function setPlainPassword(?string $plainPassword): void
    {
        if (null !== $plainPassword && strlen($plainPassword) > 0) {
            $this->password = null;
        }
        $this->plainPassword = $plainPassword;
    }

    public function __toString(): string
    {
        return sprintf("%s %s %s", $this->getLastName(), $this->getFirstName(), $this->getPatronymic());
    }

    public function getSalt(): ?string
    {
        return '';
    }

    public function getUserIdentifier(): string
    {
        return $this->login;
    }

    /**
     * @return string
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * @param string $token
     */
    public function setToken(string $token): void
    {
        $this->token = $token;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    public function getEmploymentDate(): ?\DateTime
    {
        return $this->employmentDate;
    }

    public function setEmploymentDate(?\DateTime $employmentDate): void
    {
        $this->employmentDate = $employmentDate;
    }

    public function getDismissalDate(): ?\DateTime
    {
        return $this->dismissalDate;
    }

    public function setDismissalDate(?\DateTime $dismissalDate): void
    {
        $this->dismissalDate = $dismissalDate;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = "ROLE_USER";
        return array_unique($roles);
    }

    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }
}
