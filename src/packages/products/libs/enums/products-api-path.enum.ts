const ProductsApiPath = {
  ROOT: '/',
  $ID: '/:id',
  SEARCH: '/search',
  TOP: '/top',
  IMAGES: '/images/:id',
  NEW: '/new',
} as const;

export { ProductsApiPath };
