import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFavoritesDto } from 'src/favorite/dto/create-favorites.dto';
import { CreateCartDto } from 'src/cart/dto/create-cart.dto';
import { CartService } from "../cart/cart.service";
import { FavoriteService } from "../favorite/favorite.service";
import { CreateNotificationDto } from 'src/notification/dto/notification.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,    
    //@InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
    private notificationService: NotificationService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
  ) { }

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.create(dto);
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
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }
    // const role = await this.roleService.getRoleByValue(dto.value)
    // if (role) {
    //   user.roles.push(role.id);
    //   await user.save();
    //   return dto;
    // }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async banUserById(dto: BanUserDto) {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.isBaned = true;
    user.banReason = dto.banReason;
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
        { banReason: { $regex: search, $options: 'i' } },
      ],
      isDeleted: false,
    };

    const users = await this.userRepository.find(filterConditions).sort(sort).skip(skip).limit(limit);

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
      filter,
    };
  }

  async unbanUser(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (!user.isBaned) {
      throw new HttpException('Пользователь не забанен', HttpStatus.NOT_FOUND);
    }
    user.isBaned = false;
    user.banReason = undefined;
    return await user.save();
  }

  async addToCart(userId: string, dto: CreateCartDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await this.cartService.addToCart(userId, dto)
  }

  async removeFromCart(userId: string, productCardId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await this.cartService.removeFromCart(userId, productCardId)
  }

  async addToFavorites(userId: string, dto: CreateFavoritesDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await this.favoriteService.addToFavorite(userId, dto)
  }

  async removeFromFavorite(userId: string, productCardId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await this.favoriteService.removeFromFavorite(userId, productCardId)
  }

  async findById(userId: string) {
    return this.userRepository.findById(userId).exec();
  }

  async denyProductPublishingRequest(productId: string, userId: string, message: string): Promise<void> {
    //   const productCard = await this.productCardRepository.findById(productId);
    //   if (!productCard) {
    //     throw new Error('Товар не найден');
    //   }

    //   productCard.published = false;

    //   const notification = new this.notificationRepository({
    //     userId,
    //     message,
    //   });

    //   productCard.notifications.push(notification);

    //   await Promise.all([productCard.save(), notification.save()]);
  }

  async createNotification(dto: CreateNotificationDto) /*: Promise<NotificationDocument>*/ {
    return this.notificationService.createNotification(dto.userId, dto.message);
  }

  async markNotificationAsRead(notificationId: string)/* : Promise<NotificationDocument>*/ {
    return this.notificationService.markNotificationAsRead(notificationId);
  }

  async getUserNotifications(userId: string)/*: Promise<NotificationDocument[]>*/ {
    return this.notificationService.getUserNotifications(userId);
  }
}
