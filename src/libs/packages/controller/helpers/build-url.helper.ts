const SEPARATOR = '://';
const buildUrl = (protocol: string, hostname: string): string =>
  `${protocol}${SEPARATOR}${hostname}`;

export { buildUrl };
