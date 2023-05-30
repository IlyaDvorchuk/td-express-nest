import {Body, Controller, Get, Post, Req, UseGuards, UsePipes} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import {JwtAuthGuard} from "../middlewares/auth.middleware";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 200, type: 'sddsf'})
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  @ApiOperation({summary: 'Получение всех пользователей'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Get()
  getAll() {
    return this.usersService.getAllUsers()
  }

  @ApiOperation({summary: 'Выдать роль'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto)
  }

  @ApiOperation({summary: 'Забанить пользователя'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Post('/ban')
  ban(@Body() dto: BanUserDto) {
    return this.usersService.banUserById(dto)
  }

  @ApiOperation({summary: 'Забанить пользователя'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Post('/unbanUser')
  unbanUser(@Body() dto: BanUserDto) {
    return this.usersService.unbanUser(dto.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/addToCart')
  addItemToCart(@Req() req) {
    const userId = req.user.id
    return userId
  }
}
