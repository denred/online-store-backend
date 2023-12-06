import { TemplateName } from '../enums/enums.js';
import { type TemplateNameToView } from '../types/types.js';
import { orderConfirmationView } from '../views/views.js';

const templateNameToView: TemplateNameToView = {
  [TemplateName.ORDER_CONFIRMATION]: orderConfirmationView,
};

export { templateNameToView };
