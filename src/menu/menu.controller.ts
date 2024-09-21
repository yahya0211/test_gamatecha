import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Success created cafe',
    type: CreateMenuDto,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Roles do not match',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Cafe is already created',
  })
  @Roles(Role.SUPERADMIN, Role.OWNER, Role.MANAGER)
  @Post(':cafeId')
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @Param('cafeId') cafeId: string,
    @Request() req,
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = this.jwtService.decode(token);
      const userId = decoded.id;
      return await this.menuService.createMenu(createMenuDto, cafeId, userId);
    } catch (error) {
      console.log(error);
      throw new Error('Error add menu');
    }
  }

  @ApiCreatedResponse({
    status: 200,
    description: 'Success get all cafe',
    type: [CreateMenuDto],
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
    return await this.menuService.findAllMenu();
  }

  @ApiCreatedResponse({
    status: 200,
    description: 'Success get all cafe',
    type: CreateMenuDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Menu not found',
  })
  @Get(':id')
  async findMenu(@Param('id') id: string) {
    return await this.menuService.findMenu(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.OWNER, Role.MANAGER)
  @ApiBearerAuth()
  @ApiForbiddenResponse({
    status: 403,
    description: 'Roles do not match',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Success get all cafe',
    type: CreateMenuDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Menu not found',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    try {
      return await this.menuService.updateMenu(id, updateMenuDto);
    } catch (error) {
      console.log(error);
      throw new Error('Error update menu');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.SUPERADMIN, Role.MANAGER)
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
  async remove(@Param('id') id: string) {
    return await this.menuService.removeMenu(id);
  }
}
