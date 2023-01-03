import { registerDecorator } from 'class-validator';

const IsTonHexAddress = () => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isTonHexAddress',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a TON smart-contract hex address`,
      },
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          if (typeof value !== 'string') {
            return false;
          }

          const addressParts = value.split(':');

          if (addressParts.length !== 2) {
            return false;
          }

          return isFinite(+addressParts[0]) && addressParts[1].length === 64;
        },
      },
    });
  };
};

export default IsTonHexAddress;
