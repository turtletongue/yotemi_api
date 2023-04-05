import { Transform } from 'class-transformer';

import { booleanStringToBoolean } from '@common/utils';

const StringToBoolean = () =>
  Transform(({ value }) => booleanStringToBoolean[value]);

export default StringToBoolean;
