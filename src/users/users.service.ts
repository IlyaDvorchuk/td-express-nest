import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { User, UserDocument } from "./users.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userRepository: Model<UserDocument>) {
  }

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.create(dto)
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findById(dto.userId)
    // const role = await this.roleService.getRoleByValue(dto.value)
    // if (role && user) {
    //   await user.$add('role', role.id)
    //   return dto
    // }
    throw new HttpException('Пользователь или роль не найдена', HttpStatus.NOT_FOUND)
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findById(dto.userId)
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
    // user.banned = true
    // user.banReason = dto.banReason
    await user.save()
    return user
  }
}
