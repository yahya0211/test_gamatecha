import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CafeService {
  constructor(private readonly prisma: PrismaService) {}
  async createCafe(createCafeDto: CreateCafeDto, userId: string) {
    var cleaned = ('' + createCafeDto.phoneNumber).replace(/\D/g, '');

    var numberFormat = cleaned.match(/^(\d{2})(\d{3,4})(\d{3,4})(\d{0,4})$/);

    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }

    let formattedPhoneNumber: string;

    if (numberFormat) {
      var intlCode = '[+62]';
      formattedPhoneNumber = [
        intlCode,
        numberFormat[2],
        '-',
        numberFormat[3],
        numberFormat[4] ? '-' + numberFormat[4] : '',
      ].join('');
    } else {
      formattedPhoneNumber = cleaned;
    }

    return await this.prisma.cafe.create({
      data: {
        name: createCafeDto.name,
        address: createCafeDto.address,
        phoneNumber: formattedPhoneNumber,
        userId: userId,
      },
      include: {
        menu: true,
      },
    });
  }

  async findAllCafe() {
    return await this.prisma.cafe.findMany({
      include: {
        menu: true,
      },
    });
  }

  async findCafe(id: string) {
    return await this.prisma.cafe.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateCafeDto: UpdateCafeDto, userId: string) {
    const findCafe = await this.prisma.cafe.findUnique({
      where: {
        id: id,
      },
    });

    if (!findCafe) {
      throw new NotFoundException('Cafe not found');
    }

    const findUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    if (findUser.role !== 'SUPERADMIN' && findCafe.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this cafe',
      );
    }

    var cleaned = ('' + updateCafeDto.phoneNumber).replace(/\D/g, '');

    var numberFormat = cleaned.match(/^(\d{2})(\d{3,4})(\d{3,4})(\d{0,4})$/);

    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }

    let formattedPhoneNumber: string;

    if (numberFormat) {
      var intlCode = '[+62]';
      formattedPhoneNumber = [
        intlCode,
        numberFormat[2],
        '-',
        numberFormat[3],
        numberFormat[4] ? '-' + numberFormat[4] : '',
      ].join('');
    } else {
      formattedPhoneNumber = cleaned;
    }

    return await this.prisma.cafe.update({
      where: {
        id: id,
      },
      data: {
        name: updateCafeDto.name,
        address: updateCafeDto.address,
        phoneNumber: formattedPhoneNumber,
      },
    });
  }

  async removeCafe(id: string, userId: string) {
    const findCafe = await this.prisma.cafe.findUnique({
      where: {
        id: id,
      },
    });

    if (!findCafe) {
      throw new NotFoundException('Cafe not found');
    }

    const findUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    if (findUser.role !== 'SUPERADMIN' && findCafe.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this cafe',
      );
    }

    return await this.prisma.cafe.delete({
      where: {
        id: id,
      },
    });
  }
}
