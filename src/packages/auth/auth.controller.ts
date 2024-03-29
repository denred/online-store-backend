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
  GooglePayload,
  SignInWIthFacebook,
  type UserSignInRequestDTO,
  type UserSignResponseWithToken,
  type UserSignUpRequestDTO,
} from './libs/types/types.js';
import {
  loginWithGoogleSchema,
  loginWithFacebookSchema,
  userSignInSchema,
  userSignUpSchema,
} from './libs/validations/validations.js';

/**
 * @swagger
 * components:
 *    schemas:
 *      SignUpUserRequest:
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
 *      SignInRequestBody:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            maxLength: 80
 *            description: Email must be a valid email address
 *          password:
 *            type: string
 *            minimum: 6
 *            maximum: 20
 *            pattern: ^(?=.*[a-z])(?=.*\\d)[\\dA-Za-z]{6,20}$
 *            description: Must be 6+ characters, at least 1 letter and 1 number
 *
 *      SignInSignUpUserResponse:
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
 *           token:
 *             type: string
 *
 *      SignInWithFacebook:
 *        type: object
 *        properties:
 *          accessToken:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          email:
 *            type: string
 *
 *      UserRole:
 *        type: string
 *        enum:
 *          - ADMIN
 *          - USER
 *
 *      GooglePayload:
 *        type: object
 *        properties:
 *          code:
 *            type: string
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

    this.addRoute({
      path: AuthApiPath.SIGN_IN,
      method: 'POST',
      validation: {
        body: userSignInSchema,
      },
      handler: (options) =>
        this.signin(
          options as ApiHandlerOptions<{
            body: UserSignInRequestDTO;
          }>,
        ),
    });

    this.addRoute({
      path: AuthApiPath.GOOGLE,
      method: 'POST',
      validation: {
        body: loginWithGoogleSchema,
      },
      handler: (options) => {
        return this.loginWithGoogle(
          options as ApiHandlerOptions<{
            body: GooglePayload;
          }>,
        );
      },
    });

    this.addRoute({
      path: AuthApiPath.FACEBOOK,
      method: 'POST',
      validation: {
        body: loginWithFacebookSchema,
      },
      handler: (options) =>
        this.signInWithFacebook(
          options as ApiHandlerOptions<{
            body: SignInWIthFacebook;
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
   *             $ref: '#/components/schemas/SignUpUserRequest'
   *       description: User auth data
   *       required: true
   *     responses:
   *       201:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SignInSignUpUserResponse'
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
  ): Promise<ApiHandlerResponse<UserSignResponseWithToken>> {
    return {
      status: HttpCode.CREATED,
      payload: await this.authService.signup(options.body),
    };
  }

  /**
   * @swagger
   * /auth/sign-in/:
   *   post:
   *     tags:
   *       - Auth API
   *     description: Sign in user into the app
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignInRequestBody'
   *       description: User auth data
   *       required: true
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SignInSignUpUserResponse'
   *       401:
   *         description: Unauthorized
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
   *                   example: This email is not registered
   */
  private async signin(
    options: ApiHandlerOptions<{
      body: UserSignInRequestDTO;
    }>,
  ): Promise<ApiHandlerResponse<UserSignResponseWithToken>> {
    return {
      status: HttpCode.OK,
      payload: await this.authService.signin(options.body),
    };
  }

  /**
   * @swagger
   * /auth/google/:
   *   post:
   *     tags:
   *       - Auth API
   *     description: Login with Google
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/GooglePayload'
   *       description: Google authentication code
   *       required: true
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SignInSignUpUserResponse'
   *       400:
   *         description: Bad Request
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
   *                   example: Invalid Google authentication code
   *       401:
   *         description: Unauthorized
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
   *                   example: Unauthorized Google login
   */

  private async loginWithGoogle(
    options: ApiHandlerOptions<{
      body: GooglePayload;
    }>,
  ): Promise<ApiHandlerResponse> {
    const { code } = options.body;

    return {
      status: HttpCode.OK,
      payload: await this.authService.loginWithGoogle(code),
    };
  }

  /**
   * @swagger
   * /auth/facebook/:
   *   post:
   *     tags:
   *       - Auth API
   *     description: Sign in with Facebook
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignInWithFacebook'
   *     responses:
   *       200:
   *         description: Successful operation
   *       400:
   *         description: Bad Request
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
   *                   example: Invalid Facebook authentication data
   *       401:
   *         description: Unauthorized
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
   *                   example: Unauthorized Facebook login
   */
  private async signInWithFacebook(
    options: ApiHandlerOptions<{
      body: SignInWIthFacebook;
    }>,
  ): Promise<ApiHandlerResponse> {
    return {
      status: HttpCode.OK,
      payload: await this.authService.signInWithFacebook(options.body),
    };
  }
}

export { AuthController };
