import { S3BaseURL } from '../enums/enums.js';

const constructKey = (uuid: string, folder = ''): string => {
  return [folder, uuid].join(S3BaseURL.PATH_SEPARATOR);
};

export { constructKey };
