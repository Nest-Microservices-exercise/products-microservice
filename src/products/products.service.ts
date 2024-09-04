import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database is connected')
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto })
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({ where: { isActive: true } });

    const lastPage = Math.ceil(totalPages / limit);
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { isActive: true }
      }),
      meta: { page, total: totalPages, lastPage }
    }
  }

  async findOne(id: number) {

    const product = await this.product.findUnique({
      where: { id, isActive: true },
    });

    if (!product)
      throw new RpcException (`This product not found #${id}`)
    return {
      data: await this.product.findUnique({
        where: { id },
      })
    }

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data
    })
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.product.update({
      where: { id },
      data: { isActive: false }
    })
  }
}
