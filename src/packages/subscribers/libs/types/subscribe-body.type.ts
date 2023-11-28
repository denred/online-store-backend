type SubscriptionBody = {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: {
    receiveNewsletter: boolean;
    productUpdates: boolean;
  };
};

export { type SubscriptionBody };
