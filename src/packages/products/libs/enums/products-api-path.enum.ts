const ProductsApiPath = {
  ROOT: '/',
  $ID: '/:id',
  SEARCH: '/search',
  IMAGES: '/images/:id',
  NEW: '/new',
} as const;

export { ProductsApiPath };
