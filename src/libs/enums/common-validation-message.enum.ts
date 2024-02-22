const CommonValidationMessage = {
  PAGE_SIZE_MUST_BE_NUMBER: 'Page size must be number',
  PAGE_INDEX_MUST_BE_NUMBER: 'Page index must be number',
  SORTING_MUST_BE_STRING: 'Sorting must be string',
  INVALID_OBJECT_ID: 'Invalid ObjectId format',
  OBJECT_ID_EMPTY: 'ObjectId must not be empty',
} as const;

export { CommonValidationMessage };
