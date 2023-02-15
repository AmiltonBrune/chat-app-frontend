import { IsDate, IsNumber, IsString } from "class-validator";

export class UserCampaignDto {

    @IsString()
    id: string;

}