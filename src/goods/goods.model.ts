import { Column, DataType, Model, Table } from "sequelize-typescript";

interface GoodCreationAttr {
  title: string,
  content: string;
  userId: number;
  image: string;
}

@Table({tableName: 'goods'})
export class Good extends Model<Good, GoodCreationAttr> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  title: string;

  @Column({type: DataType.STRING, allowNull: false})
  content: string;

  @Column({type: DataType.STRING})
  image: string

  // @ForeignKey(() => User)
  // @Column({type: DataType.STRING})
  // userId: number
  //
  // @BelongsTo(() => User)
  // author: User
}