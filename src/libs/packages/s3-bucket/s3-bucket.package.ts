import {
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  GetObjectCommand,
  PutObjectCommand,
  type PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

import { type IConfig } from '../config/config.js';
import { type EnvironmentSchema } from '../config/types/environment-schema.type.js';
import { type ILogger } from '../logger/logger.js';

type Constructor = { config: IConfig<EnvironmentSchema>; logger: ILogger };

class S3Bucket {
  private s3Client: S3Client;

  private bucketName: string;

  private signedUrlExpiresIn: number;

  private logger: ILogger;

  public constructor({ config, logger }: Constructor) {
    this.s3Client = new S3Client({
      region: config.ENV.AWS.S3.REGION,
      credentials: {
        accessKeyId: config.ENV.AWS.ACCESS_KEY_ID,
        secretAccessKey: config.ENV.AWS.SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = config.ENV.AWS.S3.BUCKET_NAME;
    this.signedUrlExpiresIn = config.ENV.AWS.S3.SIGNED_URL_EXPIRES_IN_SECONDS;
    this.logger = logger;
  }

  public async getObjectBuffer(key: string): Promise<Buffer | null> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
    const result = await this.s3Client.send(command);
    this.logger.info(`Get object (byte array): request sent. Key: "${key}"`);

    if (!result.Body) {
      return null;
    }

    const contents = await result.Body.transformToByteArray();

    return Buffer.from(contents);
  }

  public async putObject(
    key: string,
    body: Buffer,
    contentType?: string,
  ): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    const result = await this.s3Client.send(command);
    this.logger.info(`Put object: request sent. Key: "${key}"`);

    return result;
  }

  public async updateObjectKey(
    oldKey: string,
    newKey: string,
  ): Promise<PutObjectCommandOutput | null> {
    const oldObject = await this.getObjectBuffer(oldKey);

    if (!oldObject) {
      return null;
    }

    await this.deleteObject(oldKey);

    return await this.putObject(newKey, oldObject);
  }

  public async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const result = await this.s3Client.send(command);
    this.logger.info(
      `Delete object (presigned URL): request sent. Key: "${key}"`,
    );

    return result;
  }
}

export { S3Bucket };
