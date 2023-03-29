import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";

interface TokenCreationAttr {
  email: string,
  password: string;
}

@Table({tableName: 'tokens'})
export class Token extends Model<Token, TokenCreationAttr> {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbW...',
    description: 'refresh token для авторизации'})
  @Column({type: DataType.STRING, unique: true})
  refreshToken: string;

  @ForeignKey(() => User)
  @Column({type: DataType.STRING})
  userId: number

  @BelongsTo(() => User)
  author: User
}