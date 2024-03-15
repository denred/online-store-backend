interface IFacebookAuth {
  verifyToken(accessToken: string): Promise<boolean>;
}
export { type IFacebookAuth };
