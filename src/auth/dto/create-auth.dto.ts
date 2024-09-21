import { Role } from '../entities/auth.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateAuthDto {
  id: string;

  @ApiProperty({
    description: 'username',
    example: 'johndoe',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'fullname',
    example: 'John Doe',
  })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'password',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'role',
    example: 'OWNER',
  })
  @IsNotEmpty()
  role: Role;
}
