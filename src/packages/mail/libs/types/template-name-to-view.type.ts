import { type IView } from '~/libs/packages/view/libs/interfaces/interfaces.js';

import { type TemplateName } from '../enums/enums.js';

type TemplateNameToView = {
  [TemplateName.ORDER_CONFIRMATION]: IView;
};

export { type TemplateNameToView };
