import { type File } from '@prisma/client';

import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
} from '~/libs/packages/controller/controller.js';
import { HttpCode } from '~/libs/packages/http/http.js';
import { type ILogger } from '~/libs/packages/logger/logger.js';

import { type FilesService } from './files.service.js';
import { FilesApiPath } from './libs/enums/enums.js';
import {
  type FileUploadResponseDto,
  type MultipartParsedFile,
} from './libs/types/types.js';
import {
  filesKeyRequestParameters,
  filesUpdateKeyRequestBody,
} from './libs/validations/validations.js';

/**
 * @swagger
 * components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    schemas:
 *      ErrorType:
 *        type: object
 *        properties:
 *          errorType:
 *            type: string
 *            example: COMMON
 *            enum:
 *             - COMMON
 *             - VALIDATION
 *      FileAlreadyExists:
 *        allOf:
 *          - $ref: '#/components/schemas/ErrorType'
 *          - type: object
 *            properties:
 *              message:
 *                type: string
 *                enum:
 *                 - File *name* already exists!
 *      FileDoesNotExist:
 *        allOf:
 *          - $ref: '#/components/schemas/ErrorType'
 *          - type: object
 *            properties:
 *              message:
 *                type: string
 *                enum:
 *                 - File with such id does not exist!
 *      File:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: number
 *            minimum: 1
 *          key:
 *            type: string
 *            minLength: 1
 *            pattern: ^\w(?:[\w .-]*\w)?\.[\w-]+$
 *            example: image.jpg
 *          contentType:
 *            type: string
 *            pattern: \w+/[-+.\w]+
 *            description: Valid MIME type
 *            example: image/png
 *
 * security:
 *   - bearerAuth: []
 */
class FilesController extends Controller {
  private fileService: FilesService;

  public constructor(logger: ILogger, filesService: FilesService) {
    super(logger, ApiPath.FILES);

    this.fileService = filesService;

    this.addRoute({
      path: FilesApiPath.ROOT,
      method: 'POST',
      handler: (options) =>
        this.create(
          options as ApiHandlerOptions<{
            parsedFiles: MultipartParsedFile[];
          }>,
        ),
    });

    this.addRoute({
      path: FilesApiPath.$ID,
      method: 'PUT',
      validation: {
        body: filesUpdateKeyRequestBody,
        params: filesKeyRequestParameters,
      },
      handler: (options) =>
        this.update(
          options as ApiHandlerOptions<{
            body: Pick<File, 'key'>;
            params: Pick<File, 'id'>;
          }>,
        ),
    });

    this.addRoute({
      path: FilesApiPath.$ID,
      method: 'DELETE',
      validation: {
        params: filesKeyRequestParameters,
      },
      handler: (options) =>
        this.delete(
          options as ApiHandlerOptions<{
            params: Pick<File, 'id'>;
          }>,
        ),
    });

    this.addRoute({
      path: `${FilesApiPath.URL_ROOT}${FilesApiPath.$ID}`,
      method: 'GET',
      validation: {
        params: filesKeyRequestParameters,
      },
      handler: (options) =>
        this.getUrlById(
          options as ApiHandlerOptions<{
            params: Pick<File, 'id'>;
          }>,
        ),
    });

    this.addRoute({
      path: FilesApiPath.$ID,
      method: 'GET',
      validation: {
        params: filesKeyRequestParameters,
      },
      handler: (options) =>
        this.getRecordById(
          options as ApiHandlerOptions<{
            params: Pick<File, 'id'>;
          }>,
        ),
    });
  }

  /**
   * @swagger
   * /files/:
   *    post:
   *      security:
   *        - bearerAuth: []
   *      tags:
   *       - Files API
   *      summary: Upload files
   *      description: Upload files
   *      requestBody:
   *        content:
   *          multipart/form-data:
   *            schema:
   *              type: object
   *              properties:
   *                files:
   *                  type: array
   *                  items:
   *                    type: string
   *                    format: binary
   *      responses:
   *        201:
   *          description: Successful file upload.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  totalCount:
   *                    type: number
   *                  items:
   *                    $ref: '#/components/schemas/File'
   *        400:
   *          description:
   *            File with such name already exists
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/FileAlreadyExists'
   */
  private async create(
    options: ApiHandlerOptions<{
      parsedFiles: MultipartParsedFile[];
    }>,
  ): Promise<ApiHandlerResponse<FileUploadResponseDto>> {
    const files = Array.isArray(options.parsedFiles)
      ? options.parsedFiles
      : [options.parsedFiles];
    const uploadedFiles = await this.fileService.createMany(files);

    return {
      status: HttpCode.CREATED,
      payload: {
        items: uploadedFiles,
        totalCount: uploadedFiles.length,
      },
    };
  }

  /**
   * @swagger
   * /files/{id}:
   *    put:
   *      security:
   *        - bearerAuth: []
   *      tags:
   *       - Files API
   *      summary: Update stored file name
   *      description: Update stored file name
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *          required: true
   *          description: Numeric ID of the file whose name to update
   *          example: "655e746c67e36e93136fcb97"
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              required:
   *                - key
   *              properties:
   *                key:
   *                  $ref: '#/components/schemas/File/properties/key'
   *      responses:
   *        200:
   *          description: Successful file name update.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  result:
   *                    $ref: '#/components/schemas/File'
   *        400:
   *          description:
   *            File with such id does not exist
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/FileDoesNotExist'
   */

  private async update(
    options: ApiHandlerOptions<{
      params: Pick<File, 'id'>;
      body: Pick<File, 'key'>;
    }>,
  ): Promise<ApiHandlerResponse> {
    const updatedFileRecord = await this.fileService.softUpdate(
      options.params.id,
      options.body,
    );

    return {
      status: HttpCode.OK,
      payload: {
        result: updatedFileRecord,
      },
    };
  }

  /**
   * @swagger
   * /files/{id}:
   *    delete:
   *      security:
   *        - bearerAuth: []
   *      tags:
   *       - Files API
   *      summary: Delete stored file
   *      description: Delete stored file
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *          required: true
   *          description: Numeric ID of the file to delete
   *          example: "655e746c67e36e93136fcb97"
   *      responses:
   *        200:
   *          description: Successful attempt to delete a file
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  result:
   *                    type: boolean
   *                    description: true, if file was found and deleted, false, if file was not found.
   *        400:
   *          description:
   *            File with such id does not exist
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/FileDoesNotExist'
   */

  private async delete(
    options: ApiHandlerOptions<{
      params: Pick<File, 'id'>;
    }>,
  ): Promise<ApiHandlerResponse> {
    const deletionResult = await this.fileService.delete(options.params.id);

    return {
      status: HttpCode.OK,
      payload: {
        result: deletionResult,
      },
    };
  }

  /**
   * @swagger
   * /files/url/{id}:
   *    get:
   *      security:
   *        - bearerAuth: []
   *      tags:
   *       - Files API
   *      summary: Get stored file's temporary URL
   *      description: Get stored file's temporary URL
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *          required: true
   *          description: Numeric ID of the file whose temporary URL to get
   *          example: "655e746c67e36e93136fcb97"
   *      responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  result:
   *                    type: string
   *        400:
   *          description:
   *            File with such id does not exist
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/FileDoesNotExist'
   */

  private async getUrlById(
    options: ApiHandlerOptions<{
      params: Pick<File, 'id'>;
    }>,
  ): Promise<ApiHandlerResponse> {
    const url = await this.fileService.getUrlById(options.params.id);

    return {
      status: HttpCode.OK,
      payload: { result: url },
    };
  }

  /**
   * @swagger
   * /files/{id}:
   *    get:
   *      security:
   *        - bearerAuth: []
   *      tags:
   *       - Files API
   *      summary: Get stored file's database record
   *      description: Get stored file's database record
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *          required: true
   *          description: Numeric ID of the file whose database record to get
   *          example: "655e746c67e36e93136fcb97"
   *      responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  result:
   *                    $ref: '#/components/schemas/File'
   *        400:
   *          description:
   *            File with such id does not exist
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/FileDoesNotExist'
   */

  private async getRecordById(
    options: ApiHandlerOptions<{
      params: Pick<File, 'id'>;
    }>,
  ): Promise<ApiHandlerResponse> {
    const fileRecord = await this.fileService.findById(options.params.id);

    return {
      status: HttpCode.OK,
      payload: { result: fileRecord },
    };
  }
}

export { FilesController };
