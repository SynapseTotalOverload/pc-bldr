export const CardBox = () => {

    const title = "Skin 11111 edddddddddd  dddddddddvve ve f w e fb h j w e b fi hu webfuhw bhfbiw euhfbwueih fbwhufbiwue bweefiwebf hwe"
  return (
    <div className="rounded-lg p-4 relative">
        <div className="absolute top-4 right-8 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
        Rifles
        </div>
        <img src="https://www.csgodatabase.com/images/skins/webp/AK-47_Case_Hardened.webp" alt="Skin 1" className="w-[200px] h-[200px] object-cover bg-gray-100" />
        <h1 className="text-xl font-bold mt-2 truncate" title={title}>
          {title.length > 100 
            ? title.substring(0, 100) + "..."
            : title
          }
        </h1>
    </div>
  )
}