import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DomainDto {
  /**
   * 32-bit value of utf-8 encoded app domain name length in bytes.
   * @example 15
   */
  @IsInt()
  @IsNotEmpty()
  public lengthBytes: number;

  /**
   * App domain name.
   * @example 'localhost:63342'
   */
  @IsString()
  @IsNotEmpty()
  public value: string;
}

export default class SignatureDto {
  /**
   * Domain what requested signature.
   */
  @ValidateNested()
  @Type(() => DomainDto)
  @IsNotEmpty()
  public domain: DomainDto;

  /**
   * AuthId of user to authenticate.
   * @example '82850d07-67b7-46ab-aa84-369fe145cbf4'
   */
  @IsString()
  @IsNotEmpty()
  public payload: string;

  /**
   * Signature signed with user's private key.
   * @example 'uT014Pd1zXRYKyoetnJhBwaRRYPOzsDmLjeY8WR9NB6kaQGXAPjqk/FrSw5VOWc6zePTGSqKz39Yz7mabM+iCw=='
   */
  @IsString()
  @IsNotEmpty()
  public signature: string;

  /**
   * 64-bit unix epoch time of the signing operation.
   * @example 1672743460
   */
  @IsNumber()
  @IsNotEmpty()
  public timestamp: bigint;
}
