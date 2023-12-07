import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
  HttpCode,
  type ILogger,
} from '~/libs/packages/packages.js';

import { type AuthService } from './auth.service.js';
import { AuthApiPath } from './libs/enums/enums.js';
import {
  type UserSignUpRequestDTO,
  type UserSignUpResponseDTO,
} from './libs/types/types.js';
import { userSignUpSchema } from './libs/validations/validations.js';

/**
 * @swagger
 * components:
 *    schemas:
 *      CreateUserRequest:
 *        type: object
 *        properties:
 *          phone:
 *            type: string
 *            pattern: ^\+(?:\d{1,4}\s?)?\d{7,11}$
 *            description: Must be in international format, starting with +
 *          email:
 *            type: string
 *            format: email
 *            maxLength: 80
 *            description: Email must be a valid email address
 *          firstName:
 *            type: string
 *            minLength: 2
 *            maxLength: 50
 *            example: Bob
 *          lastName:
 *            type: string
 *            minLength: 2
 *            maxLength: 50
 *            example: Sponge
 *          password:
 *            type: string
 *            minimum: 6
 *            maximum: 20
 *            pattern: ^(?=.*[a-z])(?=.*\\d)[\\dA-Za-z]{6,20}$
 *            description: Must be 6+ characters, at least 1 letter and 1 number
 *
 *      CreateUserResponse:
 *         type: object
 *         properties:
 *           firstName:
 *             type: string
 *           lastName:
 *             type: string
 *           phone:
 *             type: string
 *           email:
 *             type: string
 *           id:
 *             type: string
 *           role:
 *             $ref: '#/components/schemas/UserRole'
 *           createdAt:
 *             type: string
 *             format: date-time
 *           updatedAt:
 *             type: string
 *             format: date-time
 *
 *      UserRole:
 *        type: string
 *        enum:
 *          - ADMIN
 *          - USER
 *
 */
class AuthController extends Controller {
  private authService: AuthService;

  public constructor(logger: ILogger, authService: AuthService) {
    super(logger, ApiPath.AUTH);
    this.authService = authService;

    this.addRoute({
      path: AuthApiPath.SIGN_UP,
      method: 'POST',
      validation: {
        body: userSignUpSchema,
      },
      handler: (options) =>
        this.signup(
          options as ApiHandlerOptions<{
            body: UserSignUpRequestDTO;
          }>,
        ),
    });
  }

  /**
   * @swagger
   * /auth/sign-up/:
   *   post:
   *     tags:
   *       - Auth API
   *     description: Sign up user into the app
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *       description: User auth data
   *       required: true
   *     responses:
   *       201:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateUserResponse'
   *       409:
   *         description: User already exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errorType:
   *                   type: string
   *                   example: COMMON
   *                 message:
   *                   type: string
   *                   example: User already exists
   */
  private async signup(
    options: ApiHandlerOptions<{
      body: UserSignUpRequestDTO;
    }>,
  ): Promise<ApiHandlerResponse<UserSignUpResponseDTO>> {
    return {
      status: HttpCode.CREATED,
      payload: await this.authService.signup(options.body),
    };
  }
}

export { AuthController };
