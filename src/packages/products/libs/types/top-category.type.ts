import { type Subcategory } from '@prisma/client';

import { type ValueOf } from '~/libs/types/types.js';

type TopCategory = { id: string; name: ValueOf<Subcategory>; url: string };

export { type TopCategory };
