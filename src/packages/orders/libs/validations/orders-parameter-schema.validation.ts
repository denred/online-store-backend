import joi from 'joi';

import { getStringValidationSchema } from '~/libs/helpers/helpers.js';

import { OrderErrorMessage } from '../enums/enums.js';

const ordersParametersSchema = joi.object<{ id: string }, true>({
  id: getStringValidationSchema(OrderErrorMessage.INVALID_ID),
});

export { ordersParametersSchema };
