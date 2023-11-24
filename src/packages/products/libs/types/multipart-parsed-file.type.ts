type MultipartParsedFile = {
  file?: Buffer;
  _buf?: Buffer;
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  content: Buffer;
};

export { type MultipartParsedFile };
