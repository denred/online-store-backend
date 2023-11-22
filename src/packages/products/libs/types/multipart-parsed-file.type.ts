type MultipartParsedFile = {
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  content: Buffer;
};

export { type MultipartParsedFile };
