import { HttpException, HttpStatus } from "@nestjs/common";
import { extname } from 'path';
import * as uuid from 'uuid'

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = uuid.v4();
  console.log('name', name)
  console.log('${randomName}${fileExtName}', `${randomName}${fileExtName}`)
  callback(null, `${randomName}${fileExtName}`);
};
