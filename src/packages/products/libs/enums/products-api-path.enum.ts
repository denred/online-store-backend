const ProductsApiPath = {
  ROOT: '/',
  $ID: '/:id',
  SEARCH: '/search',
  TOP: '/top',
  IMAGES: '/images/:id',
  NEW: '/new',
  FILTER: '/filter',
  UPDATE_QUANTITY: '/update-quantity/:id',
} as const;

export { ProductsApiPath };
