import type { EntityDTO } from "helpers/entity.dto";
import type { UserRoleDTO } from "helpers/routes";

export interface UserDTO extends EntityDTO {
  login?: string;
  lastName?: string;
  name?: string;
  patronymic?: string;
  roles: string[];
  startPage?: UserRoleDTO;
}
