import {Module} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {UsersModule} from "../users/users.module";
import {ProductCardsModule} from "../productCard/productCard.module";
import {SheltersModule} from "../shelters/shelters.module";
import {NotificationsModule} from "../notification/notification.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Promocode, PromocodeSchema} from "./promocode.schema";
import {PromocodeService} from "./admin.service";

@Module({
    controllers: [AdminController],
    providers: [PromocodeService],
    imports: [
        UsersModule,
        ProductCardsModule,
        SheltersModule,
        NotificationsModule,
        MongooseModule.forFeature([
            {name: Promocode.name, schema: PromocodeSchema}
        ]),
    ]
})
export class AdminModule {}