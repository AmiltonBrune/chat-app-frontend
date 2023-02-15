import { IsString } from "class-validator";

export class ResultReconheceDto {

   @IsString()
   dados: any;

   @IsString()
   sucesso: boolean;

   @IsString()
   mensagem: string;

   public static Error(message: string): ResultReconheceDto {
      const result = new ResultReconheceDto();
      result.dados = null;
      result.sucesso = false;
      result.mensagem = message;
      return result;
   }
   public static Success(obj: any): ResultReconheceDto {
      const result = new ResultReconheceDto();
      result.dados = obj;
      result.sucesso = true;
      result.mensagem = '';
      return result;
   }
}