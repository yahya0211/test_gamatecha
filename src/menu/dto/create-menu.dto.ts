import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMenuDto {
  id: string;

  @ApiProperty({
    description: 'Name of the menu',
    example: 'Menu 1',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Price menu',
    example: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Recommendation menu',
    example: true,
  })
  @IsNotEmpty()
  isRecomendation: boolean;

  userId: string;

  cafeId: string;
}
