import { Product } from "@/services/types"

export const CardBox = ({ item }: { item: Product }) => {
  console.log(item)
    const title = item.display_name || item.name
  return (
    <div className="rounded-lg p-4 relative">
        <div className="absolute top-4 right-8 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
        {item.category}
        </div>
        <img src={item.low_image_url} alt={item.title} className="w-[200px] h-[200px] object-cover bg-gray-100" />
        <h1 className="text-xl font-bold mt-2 truncate" title={title}>
          {title}
        </h1>
    </div>
  )
}