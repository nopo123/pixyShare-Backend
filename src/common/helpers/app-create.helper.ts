import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export const validationPipelinesHelper = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: false,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
      stopAtFirstError: true,
      errorHttpStatusCode: 400, // Set to 400 Bad Request
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const flattenedErrors = flattenValidationErrors(validationErrors);
        console.log('Validation errors:', flattenedErrors);
        throw new BadRequestException(flattenedErrors);
      },
    }),
  );

  return app;
};

export function flattenValidationErrors(
  errors: ValidationError[],
): { field: string; error: string }[] {
  return errors.reduce((acc, error) => {
    if (error.constraints) {
      acc.push({
        field: error.property,
        error: Object.values(error.constraints).join(', '),
      });
    }
    if (error.children && error.children.length) {
      acc.push(
        ...flattenValidationErrors(error.children).map((childError) => ({
          field: `${error.property}.${childError.field}`,
          error: childError.error,
        })),
      );
    }
    return acc;
  }, []);
}
