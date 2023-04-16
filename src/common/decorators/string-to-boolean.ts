import { Transform } from 'class-transformer';

import { booleanStringToBoolean } from '@common/utils';

const StringToBoolean = () =>
  Transform(({ value }) => {
    console.log('transform', value, booleanStringToBoolean[value]);
    return booleanStringToBoolean[value];
  });

export default StringToBoolean;
