import { IsString } from "class-validator";
import { ParticipantDto } from "../";

export class ParticipantAddressDto {

    @IsString()
    id: string;

    @IsString()
    readonly description: string;

    participant: ParticipantDto;

    @IsString()
    zipCode: string;

    @IsString()
    address: string;

    @IsString()
    number: string;

    @IsString()
    complement: string;

    @IsString()
    district: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    country: string;

}