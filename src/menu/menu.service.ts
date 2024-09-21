import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  async createMenu(
    createMenuDto: CreateMenuDto,
    cafeId: string,
    userId: string,
  ) {
    const findCafe = await this.prisma.cafe.findUnique({
      where: {
        id: cafeId,
      },
      select: {
        userId: true,
      },
    });

    if (!findCafe) {
      throw new NotFoundException('Cafe not found');
    }

    const createMenu = await this.prisma.menu.create({
      data: {
        name: createMenuDto.name,
        price: createMenuDto.price,
        isRecomendation: createMenuDto.isRecomendation,
        cafeId,
        userId,
      },
    });

    return createMenu;
  }

  async findAllMenu() {
    return await this.prisma.menu.findMany({
      include: {
        cafe: true,
      },
      orderBy: {
        price: 'desc',
      },
    });
  }

  async findMenu(id: string) {
    return await this.prisma.menu.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateMenu(id: string, updateMenuDto: UpdateMenuDto) {
    return await this.prisma.menu.update({
      where: {
        id: id,
      },
      data: {
        ...updateMenuDto,
      },
    });
  }

  async removeMenu(id: string) {
    return await this.prisma.menu.delete({
      where: {
        id: id,
      },
    });
  }
}
