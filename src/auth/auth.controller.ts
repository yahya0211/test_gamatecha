import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('User')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    status: 201,
    description: 'Register success',
    type: CreateAuthDto,
  })
  @ApiInternalServerErrorResponse({
    status: 409,
    description: 'Register failed, because user is already registered',
  })
  async create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ApiCreatedResponse({
    status: 201,
    description: 'Login success',
    content: {
      'application/json': {
        schema: {
          properties: {
            access_token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJ1eWVyMkBtYWlsLmNvbSIsImlkIjoiYzI3Nzk4MzktNWRlMy00YTk4LWI0YjgtNGY0YzBjYTU1MmY2Iiwicm9sZSI6IkJVWUVSIiwiaWF0IjoxNzI2MjI3MzgxLCJleHAiOjE3MjYzMTM3ODF9.D2UM2RMUFrGO5DHQCAdOFGCO24PWN_ISjcrrrvQg_6o',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiCreatedResponse({
    status: 201,
    description: 'Success get user',
    type: CreateAuthDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiCreatedResponse({
    status: 200,
    description: 'Success update fullname',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Failed update user',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Data not found',
  })
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.update(id, updateAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiCreatedResponse({
    status: 201,
    description: 'Success get all users',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  async findAll() {
    return this.authService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 200,
    description: 'Success delete user',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authService.remove(id);
  }
}
