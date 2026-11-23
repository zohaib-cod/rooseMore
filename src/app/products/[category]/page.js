import ProductsView from '../../../components/ProductsView';
import { use } from 'react';

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  // resolvedParams.category will be "room-decor", "bouquets", etc.
  return <ProductsView activeCategoryParam={resolvedParams.category} />;
}
