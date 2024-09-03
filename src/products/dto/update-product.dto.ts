import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsNumber()
    @IsPositive()
    id: number;
    @IsBoolean()
    isActive: boolean;
}
