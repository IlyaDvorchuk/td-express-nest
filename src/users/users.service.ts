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
    return this.userRepository.find({ isBaned: false });
  }

  async getAllBanedUsers() {
    return this.userRepository.find({ isBaned: true });
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

  async banUserById(id: string, reason: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
    user.isBaned = true;
    user.banReason = reason;
    return await user.save();
  }  

  async searchUsers(query: any) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '', filter = {} } = query;
  
    const sort = 'desc';
    const skip = (page - 1) * limit;
  
    const filterConditions = {
      ...filter,
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { banReason: { $regex: search, $options: 'i' } }
      ],
      isDeleted: false
    };
  
    const users = await this.userRepository
      .find(filterConditions)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  
    const totalUsers = await this.userRepository.countDocuments(filterConditions);
  
    return {
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      perPage: limit,
      sortBy,
      sortOrder,
      search,
      filter
    };
  }
  
  
}
