import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOne', async: false })
export class AtLeastOneConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const payload = args.object as Record<string, unknown>;

    return Object.values(payload).some(
      (v) => v !== undefined && v !== null && v !== '',
    );
  }

  defaultMessage(): string {
    return 'At least one field (firstname, lastname, etc.) must be provided for the update.';
  }
}

export function AtLeastOne(validationOptions?: ValidationOptions) {
  return function (object: object): void {
    registerDecorator({
      target: object.constructor,
      propertyName: 'atLeastOne',
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneConstraint,
    });
  };
}
