import { ColumnDef } from '@tanstack/react-table'
import { SkinRead } from '@/lib/skins-api'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

export const skinsColumns: ColumnDef<SkinRead>[] = [
  {
    header: 'Image',
    accessorKey: 'image_file',
    cell: ({ row }) => {
      return (
        <div className="w-20 h-20 rounded-lg overflow-hidden border">
          <LazyLoadImage 
            src={row.original.image_file} 
            alt={row.original.full_name}
            className="w-full h-full object-cover"
            loading="lazy"
            placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlNWU3ZWYiLz4KPC9zdmc+"
            threshold={100}
            wrapperClassName="w-20 h-20 rounded-lg overflow-hidden border"
          />
        </div>
      )
    },
  },
  {
    header: 'Skin Information',
    accessorKey: 'name',
    cell: ({ row }) => {
      return (
        <h3 className="font-semibold text-lg">{row.original.full_name}</h3>
      )
    },
           },
         {
           id: 'actions',
           header: 'Actions',
           cell: ({ row }) => {
             return (
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   // This will be handled by the parent component
                   console.log('Edit skin:', row.original)
                 }}
               >
                 <Edit className="h-4 w-4 mr-2" />
                 Edit
               </Button>
             )
           },
         },
       ] 