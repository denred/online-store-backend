const ProductsApiPath = {
  ROOT: '/',
  $ID: '/:id',
  SEARCH: '/search',
  TOP: '/top',
  IMAGES: '/images/:id',
  NEW: '/new',
  UPDATE_QUANTITY: '/update-quantity/:id',
} as const;

export { ProductsApiPath };
