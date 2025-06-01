import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);

    if (existing) {
      throw new BadRequestException('Email already used');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return newUser;
  }
}
