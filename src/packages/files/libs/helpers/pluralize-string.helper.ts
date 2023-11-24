const pluralizeString = (base: string, quantity: number): string => {
  return `${base}${quantity > 1 ? 's' : ''}`;
};

export { pluralizeString };
