import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(params: { email: string; password: string }): Promise<UserEntity> {
    const email = params.email.trim().toLowerCase();
    const password = params.password;

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email is already in use');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    const user = this.usersRepo.create({
      email,
      passwordHash,
    });

    try {
      return await this.usersRepo.save(user);
    } catch (err) {
      // Handles the small race where two signups happen concurrently.
      throw new BadRequestException('Email is already in use');
    }
  }

  async signin(params: {
    email: string;
    password: string;
  }): Promise<{ user: UserEntity; accessToken: string }> {
    const email = params.email.trim().toLowerCase();
    const password = params.password;

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      { email: user.email },
      { subject: user.id },
    );

    return { user, accessToken };
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({ where: { id } });
  }
}

