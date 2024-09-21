import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.prisma.user.findMany({
      where: {
        username: createAuthDto.username,
      },
    });

    if (existingUser.length > 0) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    return this.prisma.user.create({
      data: {
        fullname: createAuthDto.fullname,
        username: createAuthDto.username,
        password: hashedPassword,
        role: Role[createAuthDto.role],
      },
    });
  }

  async login(dto: LoginDto) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!findUser) {
      throw new UnauthorizedException('User is not registered');
    }

    const matchingPassword = await bcrypt.compare(
      dto.password,
      findUser.password,
    );

    if (!matchingPassword) {
      throw new UnauthorizedException("Password doesn't match");
    }

    const payload = {
      id: findUser.id,
      username: findUser.username,
      fullname: findUser.fullname,
      role: findUser.role,
    };

    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async findOne(dto: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: dto,
      },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    return findUser;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!findUser) {
      throw new NotFoundException('Data not found');
    }
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        fullname: updateAuthDto.fullname,
      },
    });
  }

  async findAll() {
    const findManyUser = await this.prisma.user.findMany();
    if (findManyUser.length < 0) {
      throw new NotFoundException('Data not found');
    }
    return findManyUser;
  }

  async remove(id: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!findUser) {
      throw new NotFoundException('Data not found');
    }

    return await this.prisma.user.deleteMany({
      where: {
        id: id,
      },
    });
  }
}
