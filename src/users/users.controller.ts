import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getCurrentUser(@Req() req) {
    return {
      message: 'Utilisateur connecté',
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return {
      message: 'Liste des utilisateurs',
      users,
    };
  }
}
