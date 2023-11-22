const AppErrorMessage = {
  INVALID_QUERY: 'Invalid SQL query was provided!',
  ENTITY_NOT_FOUND: 'Requested entity not found!',
  ENTITY_ACCESS_DENIED: 'The user does not have access to the entity!',
  INVALID_FILE_INPUT_CONFIG:
    'Invalid file input config was provided to file validator!',
} as const;

export { AppErrorMessage };
