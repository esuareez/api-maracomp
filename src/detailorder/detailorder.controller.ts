import { Controller } from '@nestjs/common';
import { DetailorderService } from './detailorder.service';
import { Get, Post, Delete, ValidationPipe, Body } from '@nestjs/common';

@Controller('detailorder')
export class DetailorderController {
    constructor(
        private readonly detailorderService: DetailorderService
    ){}


}
