import { Transform } from 'class-transformer';

const StringToDate = () => Transform(({ value }) => new Date(value));

export default StringToDate;
