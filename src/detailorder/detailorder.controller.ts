import { Controller } from '@nestjs/common';
import { DetailorderService } from './detailorder.service';
import { Get, Post, Delete, ValidationPipe, Body, Param } from '@nestjs/common';

@Controller('detailorder')
export class DetailorderController {
  constructor(private readonly detailorderService: DetailorderService) {}

  @Delete()
  async deleteAll() {
    return this.detailorderService.deleteAll();
  }

  @Get()
  async findAll() {
    return this.detailorderService.findAll();
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    return this.detailorderService.findAllByOrderCode(Number(code));
  }

  @Delete(':code')
  async deleteOrderAndDetails(@Param('code') code: string) {
    return this.detailorderService.deleteOrderAndDetails(Number(code));
  }
}
