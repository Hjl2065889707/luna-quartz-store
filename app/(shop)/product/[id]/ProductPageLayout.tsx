// 这个组件只负责"结构"，不负责"内容"
const ProductPageLayout = ({
  imageSlot,
  infoSlot,
}: {
  imageSlot: React.ReactNode
  infoSlot: React.ReactNode
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* 左侧 */}
        {imageSlot}
        {/* 右侧 */}
        {infoSlot}
      </div>
    </div>
  )
}

export default ProductPageLayout
