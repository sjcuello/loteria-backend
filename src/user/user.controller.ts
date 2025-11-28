import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CuitCuilValidationPipe } from '../shared/pipes/cuit-cuil-validation.pipe';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users registered in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'User list retrieved successfully',
    type: [User],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch {
      throw new HttpException(
        'Error getting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active users',
    description: 'Returns a list of all active users registered in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'User list retrieved successfully',
    type: [User],
  })
  async findAllActive(): Promise<User[]> {
    try {
      return await this.userService.findAllActive();
    } catch {
      throw new HttpException(
        'Error getting active users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns the information of a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findOne(+id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user in the system',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists in the system',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Usuario creado con éxito')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (
        errorMessage.includes('ER_DUP_ENTRY') ||
        errorMessage.includes('unique constraint')
      ) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('active/by-cuil/:cuil')
  @ApiOperation({
    summary: 'Get active user by CUIL',
    description:
      'Returns an active user registered in the system filtered by CUIL',
  })
  @ApiParam({
    name: 'cuil',
    description: 'CUIL of the user',
    example: '20-12345678-9',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  async findAllActiveByCuil(
    @Param('cuil', CuitCuilValidationPipe) cuil: string,
  ): Promise<User | null> {
    return await this.userService.findAllActiveByCuil(cuil);
  }

  @Get('is-active/by-cuil/:cuil')
  @ApiOperation({
    summary: 'Check if user is active by CUIL',
    description:
      'Returns whether the user with the given CUIL is active in the system',
  })
  @ApiParam({
    name: 'cuil',
    description: 'CUIL of the user',
    example: '20-12345678-9',
  })
  @ApiResponse({
    status: 200,
    description: 'Active status retrieved successfully',
    type: Boolean,
  })
  async checkIsActiveByCuil(
    @Param('cuil', CuitCuilValidationPipe) cuil: string,
  ): Promise<boolean> {
    return await this.userService.checkIsActiveByCuil(cuil);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates the information of an existing user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Usuario actualizado con éxito')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userService.update(+id, updateUserDto);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Usuario inhabilitado con éxito')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.userService.remove(+id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error deleting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
