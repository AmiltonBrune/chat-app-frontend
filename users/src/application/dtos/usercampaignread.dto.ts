import { IsDate, IsNumber, IsString } from "class-validator";

export class UserCampaignReadDto {

    @IsString()
    id: string;

}