import { TemplateName } from '../../enums/enums.js';
import { OrderConfirmationView } from './order-confirmation.view.js';

const orderConfirmationView = new OrderConfirmationView(
  TemplateName.ORDER_CONFIRMATION,
);

export { orderConfirmationView };
