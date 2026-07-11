import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types'

const ItemCell = ({ item }: { item: Product }) => {
  return <ProductCard product={item} />
}

export default ItemCell
