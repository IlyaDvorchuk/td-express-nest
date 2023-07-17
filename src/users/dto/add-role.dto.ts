import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddRoleDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsEnum(['USER', 'ADMIN'])
    role: string;
}
