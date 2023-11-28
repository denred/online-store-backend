type SubscribeBody = {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: {
    receiveNewsletter: boolean;
    productUpdates: boolean;
  };
};

export { type SubscribeBody };
