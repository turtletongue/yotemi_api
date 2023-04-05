import { Transform } from 'class-transformer';

const StringToNumber = () => Transform(({ value }) => +value);

export default StringToNumber;
