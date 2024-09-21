import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @ApiProperty({
    description: 'Change fullname',
    example: 'Full name change',
  })
  fullname?: string;
}
