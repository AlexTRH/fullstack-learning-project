import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body') return value;
    try {
      const parsed = this.schema.parse({
        body: value,
        query: undefined,
        params: undefined,
      });
      return (parsed as { body: unknown }).body;
    } catch (error) {
      if (error instanceof ZodError) {
        const first = error.errors[0];
        const message = first ? first.message : 'Validation failed';
        throw new BadRequestException(`Validation error: ${message}`);
      }
      throw error;
    }
  }
}
