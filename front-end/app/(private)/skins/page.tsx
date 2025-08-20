'use client'
import { SkinsTable } from "@/components/skins-table";
import { Button } from "@/components/ui/button";
import { CategoryButtons } from "@/components/ui/category-buttons";
import { useBoolean } from "@/hooks/use-boolean";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { skinsColumns } from "@/models/skins-table/columns";
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { Plus } from "lucide-react";
import { useSkins } from "@/hooks/useSkins";
import { SKIN_CATEGORIES } from "@/types/skins-base";
import { AddNewSkins } from "@/models/dialogs/add-new-skins";
import { SkinRead, deleteSkin } from "@/lib/skins-api";
import WarningModal from "@/models/dialogs/warning-modal";
import { MainMenu } from "@/components/ui/menu";

export default function Skins() {
    const [selectedCategory, setSelectedCategory] = useState<number>(SKIN_CATEGORIES.RIFLES);
    const [page, setPage] = useState(1);
    const {isState, changeState, toggleState}= useBoolean();
    const [search, setSearch] = useState('');
    const [skinToEdit, setSkinToEdit] = useState<SkinRead | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [skinToDelete, setSkinToDelete] = useState<number | null>(null);
    const router = useRouter()

    const categoryIdToString = (id: number): string => {
        const map: Record<number, string> = {
            [SKIN_CATEGORIES.KNIVES]: 'knives',
            [SKIN_CATEGORIES.GLOVES]: 'gloves',
            [SKIN_CATEGORIES.PISTOLS]: 'pistols',
            [SKIN_CATEGORIES.RIFLES]: 'rifles',
            [SKIN_CATEGORIES.SMG]: 'smg',
            [SKIN_CATEGORIES.HEAVY]: 'heavy',
        };
        return map[id] || 'rifles';
    };

    // Map string names back to category IDs
    const categoryStringToId = (name: string): number => {
        const map: Record<string, number> = {
            'knives': SKIN_CATEGORIES.KNIVES,
            'gloves': SKIN_CATEGORIES.GLOVES,
            'pistols': SKIN_CATEGORIES.PISTOLS,
            'rifles': SKIN_CATEGORIES.RIFLES,
            'smg': SKIN_CATEGORIES.SMG,
            'heavy': SKIN_CATEGORIES.HEAVY,
        };
        return map[name] || SKIN_CATEGORIES.RIFLES;
    };

    const { skins, pagination, loading, error, refetch, searchSkins } = useSkins({
        category_id: selectedCategory,
        page,
        search,
    });

    const { toast } = useToast();

    // Handle search change - automatically update search
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page when searching
        searchSkins(value); // Call searchSkins function from useSkins hook
    };

    const handleDeleteSkin = async (skinId: number) => {
        setSkinToDelete(skinId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteSkin = async () => {
        if (!skinToDelete) return;
        
        try {
          await deleteSkin(skinToDelete);
          toast({
            title: 'Success',
            description: 'Skin deleted successfully!',
          });
          refetch();
          setSearch('');
          setIsDeleteModalOpen(false);
          setSkinToDelete(null);
        } catch (error) {
          console.error('Error deleting skin:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to delete skin',
            variant: 'destructive',
          });
          setIsDeleteModalOpen(false);
          setSkinToDelete(null);
        }
    };

    const customSkinsColumns: ColumnDef<SkinRead>[] = [
      ...skinsColumns.filter(col => col.id !== 'actions'),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {

          return (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSkinToEdit(row.original);
                  changeState('addNewSkin', true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteSkin(row.original.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )
        },
      },
    ];

  return (
    <>
        <CategoryButtons
          selectedCategory={categoryIdToString(selectedCategory)}
          onSelectCategory={(category) => {
            const newCategoryId = categoryStringToId(category);
            setSelectedCategory(newCategoryId);
            setPage(1);
            setSearch('');
          }}
          isAccessories={2}
        />
          <div className="mt-8 w-full">
            <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
              <SkinsTable
                 columns={customSkinsColumns}
                 data={skins}
                  searchKey="full_name"
                  searchPlaceholder="Search skins..."
                  searchValue={search}
                  loading={loading}
                  onSearchChange={handleSearchChange}
                  pagination={{
                    currentPage: page,
                    totalPages: pagination.totalPages,
                    total: pagination.total,
                    itemsPerPage: 40
                  }}
                  onPageChange={(newPage) => setPage(newPage)}
                  renderActions={() => (
                    <Button onClick={()=>toggleState('addNewSkin')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add new skin
                    </Button>
                  )}
                />
            </div>
          </div>

      <AddNewSkins 
        open={isState('addNewSkin')}
        onOpenChange={(value)=>{changeState('addNewSkin', value)}}
        onSuccess={() => {
          refetch();
          setPage(1);
          setSkinToEdit(null);
          setSearch('');
        }}
        skinToEdit={skinToEdit}
      />

      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSkinToDelete(null);
        }}
        onConfirm={confirmDeleteSkin}
        title="Confirm Deletion"
        message="Are you sure you want to delete this skin? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}