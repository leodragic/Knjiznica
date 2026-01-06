import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    if (!email || !password || !name) {
      throw new Error('Email, password and name are required');
    }
    const hashed = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashed,
      name,
    });

    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('LOGIN INPUT:', { email, password });
    console.log('USER FROM DB:', user);
    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
