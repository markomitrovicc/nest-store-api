import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully.' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64f2e4b1...' },
            firstName: { type: 'string', example: 'Marko' },
            lastName: { type: 'string', example: 'Markovic' },
            email: { type: 'string', example: 'marko@example.com' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiConflictResponse({ description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful.' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64f2e4b1...' },
            firstName: { type: 'string', example: 'Marko' },
            lastName: { type: 'string', example: 'Markovic' },
            email: { type: 'string', example: 'marko@example.com' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }
}
