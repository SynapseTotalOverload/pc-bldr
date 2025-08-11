import { Skin } from "@/services/types"

export const CardBoxSkin = ({ item }: { item: Skin }) => {
    const wearLevelStyle = {
        'Factory New': 'bg-green-700',
        'Minimal Wear': 'bg-green-600',
        'Field-Tested': 'bg-green-500',
        'Battle-Scarred': 'bg-green-400',
        'Well-Worn': 'bg-green-300',
        'None': 'bg-green-100'
    }
    
    return (
    <div className="rounded-md p-4 relative">
        {item.is_stat_track && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
            Stat Track
            </div>
        )}
        <div className="absolute top-4 right-[65px] bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
        {item.skin?.category?.name}
        </div>
        {item.pattern && item.pattern > 0 && (
            <div className="absolute bottom-[50px] left-4 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
            Pattern {item.pattern}
            </div>
        )}
        {item.souvenir && (
            <div className="absolute top-4 left-[100px] bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            Souvenir
            </div>
        )}
        <img src={item.skin?.image_file} alt={item.skin?.name} className="w-[200px] h-[200px] object-cover bg-gray-100" />
        <h1 className="text-xl font-bold mt-2 truncate" title={item.skin?.full_name}>
          {item.skin?.full_name}
        </h1>
    </div>
  )
}