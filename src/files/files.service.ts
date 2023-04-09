import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as uuid from 'uuid'
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg'
      const filePath = path.resolve(__dirname, '../..', 'static')
      console.log('filePath', filePath);
      fs.access(
        filePath,
        (err) => {
          if (err) {
            console.log('err 16', err);
            throw new HttpException('Нет доступа к папке', HttpStatus.INTERNAL_SERVER_ERROR)
          }
          fs.mkdir(
            filePath,
            {recursive: true},
            (err) => {
              if (err) {
                throw new HttpException('Не удалось создать папку', HttpStatus.INTERNAL_SERVER_ERROR)
              }
            }
          )
        }
      )
      fs.writeFile(
        path.join(filePath, fileName),
        file.buffer,
        (err) => {
          if (err) {
            throw new HttpException('Не удалось создать файл', HttpStatus.INTERNAL_SERVER_ERROR)
          }
        }
      )
      return fileName
    } catch (e) {
      throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
