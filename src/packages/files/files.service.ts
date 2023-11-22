import { type File } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import {
  FileTransactionError,
  HttpError,
} from '~/libs/exceptions/exceptions.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode, HttpMessage } from '~/libs/packages/http/http.js';
import { type ILogger } from '~/libs/packages/logger/logger.js';
import { type S3Bucket } from '~/libs/packages/s3-bucket/s3-bucket.js';
import { type ValueOf } from '~/libs/types/types.js';

import { type MultipartParsedFile } from '../products/libs/types/types.js';
import { type FilesRepoitory } from './files.repository.js';
import { type S3PublicFolder } from './libs/enums/enums.js';
import { constructKey } from './libs/helpers/helpers.js';

class FilesService implements IService {
  private s3Bucket: S3Bucket;

  private logger: ILogger;

  private filesRepository: FilesRepoitory;

  public constructor(
    s3Bucket: S3Bucket,
    logger: ILogger,
    filesRepository: FilesRepoitory,
  ) {
    this.s3Bucket = s3Bucket;
    this.logger = logger;
    this.filesRepository = filesRepository;
  }

  public async findById(id: string): Promise<File | null> {
    const [file = null] = await this.filesRepository.findById(id);

    return file;
  }

  public async getUrlById(id: string): Promise<string> {
    const fileRecord = await this.findById(id);

    if (!fileRecord) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.FILE_DOES_NOT_EXIST,
      });
    }

    return await this.s3Bucket.getObjectPresignedUrl(fileRecord.key);
  }

  public async createMany(
    parsedFiles: MultipartParsedFile[],
    folder?: ValueOf<typeof S3PublicFolder>,
  ): Promise<File[]> {
    const filesRecords: File[] = [];

    for (const parsedFile of parsedFiles) {
      const key = constructKey(uuidv4(), folder);
      const name = parsedFile.filename;
      const body = parsedFile.content;
      let S3OperationSuccess = false;

      try {
        await this.s3Bucket.putObject(key, body, parsedFile.mimetype);

        S3OperationSuccess = true;

        const result = await this.filesRepository.create({
          contentType: parsedFile.mimetype,
          name,
          key,
        });
        filesRecords.push(result);
      } catch (error_) {
        const error = error_ as Error;

        if (S3OperationSuccess) {
          await this.s3Bucket.deleteObject(parsedFile.filename);
        }

        throw new FileTransactionError({ message: error.message });
      }
    }

    return filesRecords;
  }

  public async create(
    parsedFile: MultipartParsedFile,
    folder?: ValueOf<typeof S3PublicFolder>,
  ): Promise<File> {
    const key = constructKey(uuidv4(), folder);
    const name = parsedFile.filename;
    const body = parsedFile.content;
    let S3OperationSuccess = false;

    try {
      await this.s3Bucket.putObject(key, body);

      S3OperationSuccess = true;

      return await this.filesRepository.create({
        contentType: parsedFile.mimetype,
        name,
        key,
      });
    } catch (error_) {
      const error = error_ as Error;

      if (S3OperationSuccess) {
        await this.s3Bucket.deleteObject(parsedFile.filename);
      }

      throw new FileTransactionError({ message: error.message });
    }
  }

  public async update(
    id: string,
    parsedFile: MultipartParsedFile,
  ): Promise<File> {
    const [file = null] = await this.filesRepository.findById(id);

    if (!file) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.FILE_DOES_NOT_EXIST,
      });
    }

    const { filename, content, mimetype } = parsedFile;

    try {
      await this.s3Bucket.putObject(file.key, content, mimetype);

      return await this.filesRepository.update(id, {
        name: filename,
        contentType: mimetype,
      });
    } catch {
      this.logger.error(
        `[UPDATE_FILE]: File transaction error. Key: ${file.key}`,
      );
      throw new FileTransactionError({});
    }
  }

  public async updateByFileKey(
    key: File['key'],
    parsedFile: MultipartParsedFile,
  ): Promise<File> {
    const [file = null] = await this.filesRepository.find({ key });

    if (!file) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.FILE_DOES_NOT_EXIST,
      });
    }

    const { filename, content, mimetype } = parsedFile;

    try {
      await this.s3Bucket.putObject(file.key, content, mimetype);

      return await this.filesRepository.update(file.id, {
        name: filename,
        contentType: mimetype,
      });
    } catch {
      this.logger.error(
        `[UPDATE_FILE_BY_KEY]: File transaction error. Key: ${file.key}`,
      );
      throw new FileTransactionError({});
    }
  }

  public async softUpdate(
    id: File['id'],
    payload: Pick<File, 'key'>,
  ): Promise<File> {
    const fileRecord = await this.findById(id);

    if (!fileRecord) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.FILE_DOES_NOT_EXIST,
      });
    }

    let S3OperationSuccess = false;

    try {
      await this.s3Bucket.updateObjectKey(fileRecord.key, payload.key);

      S3OperationSuccess = true;

      return await this.filesRepository.update(id, payload);
    } catch {
      this.logger.error(
        `[UPDATE_FILE_KEY]: File transaction error. Key: ${fileRecord.key}`,
      );

      if (S3OperationSuccess) {
        await this.s3Bucket.updateObjectKey(payload.key, fileRecord.key);
      }

      throw new FileTransactionError({});
    }
  }

  public async delete(id: File['id']): Promise<boolean> {
    const fileRecord = await this.findById(id);

    if (!fileRecord) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.FILE_DOES_NOT_EXIST,
      });
    }

    const fileContent = await this.s3Bucket.getObjectBuffer(fileRecord.key);

    if (!fileContent) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.FILE_DOES_NOT_EXIST,
      });
    }

    let S3OperationSuccess = false;

    try {
      await this.s3Bucket.deleteObject(fileRecord.key);

      S3OperationSuccess = true;

      return await this.filesRepository.delete(id);
    } catch {
      this.logger.error(
        `[DELETE_FILE]: File transaction error. Key: ${fileRecord.key}`,
      );

      if (S3OperationSuccess) {
        await this.s3Bucket.putObject(fileRecord.key, fileContent);
      }

      throw new FileTransactionError({});
    }
  }
}

export { FilesService };
