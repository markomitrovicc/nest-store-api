import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.userModel
      .findOne({ email: normalizedEmail })
      .exec();

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      email: normalizedEmail,
      password: hashedPassword,
    });

    try {
      const user = await createdUser.save();

      return {
        message: 'User registered successfully.',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }

      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const normalizedEmail = loginUserDto.email.trim().toLowerCase();

    const user = await this.userModel
      .findOne({ email: normalizedEmail })
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      message: 'Login successful.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.trim().toLowerCase() }).exec();
  }
}
