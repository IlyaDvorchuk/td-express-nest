import {Module} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {UsersModule} from "../users/users.module";
import {ProductCardsModule} from "../productCard/productCard.module";
import {SheltersModule} from "../shelters/shelters.module";
import {NotificationsModule} from "../notification/notification.module";

@Module({
    controllers: [AdminController],
    imports: [UsersModule, ProductCardsModule, SheltersModule, NotificationsModule]
})
export class AdminModule {}