import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      return file + ' fgffggfgf'
    } catch (e) {
      throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
