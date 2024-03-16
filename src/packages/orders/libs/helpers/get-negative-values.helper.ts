type RecordWithNumberValues<T extends string | number | symbol> = Record<
  T,
  number
>;

const getNegativeValues = <T extends string | number | symbol>(
  payload: RecordWithNumberValues<T>,
): RecordWithNumberValues<T> => {
  const negativeValues: RecordWithNumberValues<T> = payload;
  for (const key of Object.keys(payload) as Array<keyof typeof payload>) {
    negativeValues[key] = -payload[key];
  }

  return negativeValues;
};

export { getNegativeValues };
