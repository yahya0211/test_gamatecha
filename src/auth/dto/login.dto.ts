import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Input username',
    example: 'superadmin',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Input password',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}
