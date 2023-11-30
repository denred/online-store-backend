type SubscriptionWithPreferences = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  preferences: {
    id: string;
    receiveNewsletter: boolean;
    productUpdates: boolean;
    subscriptionId: string;
  } | null;
};

export { type SubscriptionWithPreferences };
