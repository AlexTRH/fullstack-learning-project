import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service status and timestamp' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api')
  @ApiOperation({ summary: 'API info' })
  @ApiResponse({ status: 200, description: 'API running message' })
  getApi() {
    return { message: 'API is running' };
  }
}
