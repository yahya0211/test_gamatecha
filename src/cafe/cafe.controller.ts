import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('Cafe')
@Controller('cafe')
export class CafeController {
  constructor(
    private readonly cafeService: CafeService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Success created cafe',
    type: CreateCafeDto,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Roles do not match',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Cafe is already created',
  })
  @Roles(Role.SUPERADMIN, Role.OWNER)
  @Post()
  async create(@Body() createCafeDto: CreateCafeDto, @Request() req) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      const decode = this.jwtService.decode(token);

      createCafeDto.userId = decode.id;
      const userId = createCafeDto.userId;

      return await this.cafeService.createCafe(createCafeDto, userId);
    } catch (error) {
      console.log(error);
      throw new Error('Error add cafe');
    }
  }

  @ApiCreatedResponse({
    status: 201,
    description: 'Success get all cafe',
    type: [CreateCafeDto],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Cafe not found',
  })
  @Get()
  async findAll() {
    return await this.cafeService.findAllCafe();
  }

  @ApiCreatedResponse({
    status: 200,
    description: 'Success get all cafe',
    type: CreateCafeDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Cafe not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.cafeService.findCafe(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 200,
    description: 'Success update cafe',
    type: [CreateCafeDto],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Cafe not found',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Roles do not match',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCafeDto: UpdateCafeDto,
    @Request() req,
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decode = this.jwtService.decode(token);
      const userId = decode.id;
      return await this.cafeService.update(id, updateCafeDto, userId);
    } catch (error) {
      console.log(error);
      throw new Error('Error update cafe');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 200,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Roles do not match',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Cafe not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decode = this.jwtService.decode(token);
      const userId = decode.id;
      return this.cafeService.removeCafe(id, userId);
    } catch (error) {
      console.log(error);
      throw new Error('Error delete cafe');
    }
  }
}
