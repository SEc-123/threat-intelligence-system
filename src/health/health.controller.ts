import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private schedulerService: any // Assuming schedulerService is injected through the constructor
  ) {}

  @Get()
  async check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => ({ crawler: { status: 'up', timestamp: new Date() }})
    ]);
  }

  @Get('/crawler')
  checkCrawler() {
    return {
      status: this.schedulerService.isRunning ? 'healthy' : 'down',
      lastExecution: this.schedulerService.lastExecution
    };
  }
}
