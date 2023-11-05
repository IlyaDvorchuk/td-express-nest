import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Promocode, PromocodeDocument} from "./promocode.schema";

@Injectable()
export class PromocodeService {
    constructor(@InjectModel(Promocode.name) private promocodeRepository: Model<PromocodeDocument>) {}

    async addPromocode(code: string) {
        try {
            return this.promocodeRepository.create({promocode: code})
        } catch (e) {
            throw new HttpException(
                "ННе удалсть сохранить промкод",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}