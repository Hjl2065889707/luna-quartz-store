const ProductPageLayout = ({
  imageSlot,
  infoSlot,
}: {
  imageSlot: React.ReactNode
  infoSlot: React.ReactNode
}) => {
  return (
    <div className="bg-[#FBF7F1]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.9fr]">
        {imageSlot}
        {infoSlot}
      </div>
      </div>
    </div>
  )
}

export default ProductPageLayout
