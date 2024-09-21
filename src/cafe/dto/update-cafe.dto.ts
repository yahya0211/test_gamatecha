import { PartialType } from '@nestjs/mapped-types';
import { CreateCafeDto } from './create-cafe.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class UpdateCafeDto extends PartialType(CreateCafeDto) {
  @ApiProperty({
    description: 'Name of the cafe',
    example: 'Update Cafe',
  })
  name?: string;

  @ApiProperty({
    description: 'Cafe address update',
    example: 'Cafe 1 address update',
  })
  address?: string;

  @ApiProperty({
    description: 'Update phone number',
    example: '08123456789',
  })
  @IsNumberString()
  phoneNumber?: string;
}
