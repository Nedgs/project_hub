import { IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
