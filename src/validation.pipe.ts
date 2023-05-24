// validation.pipe.ts

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorMessage = errors
                .map((error) => Object.values(error.constraints))
                .join(', ');
            throw new BadRequestException(errorMessage);
        }

        return value;
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
