import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateCafeDto {
  id: string;
  @ApiProperty({
    description: 'Name of the cafe',
    example: 'Cafe 1',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cafe address',
    example: 'Cafe 1 address',
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Name of the cafe',
    example: '08123456789',
  })
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;

  userId: string;
}
