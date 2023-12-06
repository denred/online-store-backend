import path from 'node:path';
import url from 'node:url';

import { type IView, View } from '~/libs/packages/packages.js';

import { type TemplateNameValues } from '../../types/types.js';
import { type OrderConfirmationViewParameter } from './libs/types/types.js';

class OrderConfirmationView extends View implements IView {
  public constructor(templateName: TemplateNameValues) {
    const templatePath = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '..',
      'layouts',
      `${templateName}.hbs`,
    );
    super(templatePath);
  }

  public render(parameters: OrderConfirmationViewParameter): string {
    return this.compiledTemplate(parameters);
  }
}

export { OrderConfirmationView };
