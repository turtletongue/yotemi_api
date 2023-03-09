const booleanStringToBoolean = (value: string): boolean | undefined => {
  return { true: true, false: false }[value];
};

export default booleanStringToBoolean;
