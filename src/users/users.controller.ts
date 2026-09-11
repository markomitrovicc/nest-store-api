import { Controller, Get } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get('me')
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current authenticated user retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user_123' },
            name: { type: 'string', example: 'Marko Markovic' },
            email: { type: 'string', example: 'marko@example.com' },
          },
        },
      },
    },
  })
  getMe(@Session() session: UserSession) {
    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };
  }
}
