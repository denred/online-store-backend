const ProductsApiPath = {
  ROOT: '/',
  $ID: '/:id',
  SEARCH: '/search',
  TOP: '/top',
  IMAGES: '/images/:id',
  NEW: '/new',
  FILTER: '/filter',
} as const;

export { ProductsApiPath };
