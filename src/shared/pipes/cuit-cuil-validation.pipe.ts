import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CuitCuilUtils } from '../validators/cuit-cuil.validator';

@Injectable()
export class CuitCuilValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('CUIT/CUIL is required');
    }

    if (!CuitCuilUtils.isValid(value)) {
      throw new BadRequestException('Invalid CUIT/CUIL format');
    }

    return value;
  }
}
