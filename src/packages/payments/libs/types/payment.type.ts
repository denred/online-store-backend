type Payment = {
  cardNumber: string;
  cardHolder: string;
  month: number;
  year: number;
  cvv: number;
  orderId?: string;
};

export { type Payment };
