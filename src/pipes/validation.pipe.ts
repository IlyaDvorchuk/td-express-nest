import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exeptions/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any>{
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(metadata.metatype, value)
    console.log('obj 10', obj);
    const errors = await validate(obj)

    if (errors.length) {
      console.log('errors', errors);
      const messages = errors.map(err => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`
      })
      console.log('hey');
      throw new ValidationException(messages)
    }
    return value
  }

}