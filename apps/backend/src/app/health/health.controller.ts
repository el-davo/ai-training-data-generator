import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  health() {
    return { ok: true };
  }

  @Get('db')
  async db() {
    // A minimal "is it alive" check that works across sqlite/postgres/mysql.
    await this.dataSource.query('SELECT 1');
    return { ok: true };
  }
}

