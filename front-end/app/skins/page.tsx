'use client'
import { SkinsTable } from "@/components/skins-table";
import { ThemeToggle } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { CategoryButtons } from "@/components/ui/category-buttons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBoolean } from "@/hooks/use-boolean";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { skinsColumns } from "@/models/skins-table/columns";
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { Plus } from "lucide-react";
import { useSkins } from "@/hooks/useSkins";
import { SKIN_CATEGORIES } from "@/types/skins-base";
import { AddNewSkins } from "@/models/dialogs/add-new-skins";
import { SkinRead, deleteSkin } from "@/lib/skins-api";

export default function Skins() {
    const [selectedCategory, setSelectedCategory] = useState<number>(SKIN_CATEGORIES.RIFLES);
    const [page, setPage] = useState(1);
    const {isState, changeState, toggleState}= useBoolean();
    const [search, setSearch] = useState('');
    const [skinToEdit, setSkinToEdit] = useState<SkinRead | null>(null);
    const router = useRouter()

    // Map category IDs to string names for CategoryButtons
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

    const handleDeleteSkin = async (skinId: number) => {
        try {
          await deleteSkin(skinId);
          toast({
            title: 'Success',
            description: 'Skin deleted successfully!',
          });
          refetch();
          setSearch('');
        } catch (error) {
          console.error('Error deleting skin:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to delete skin',
            variant: 'destructive',
          });
        }
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin) {
          router.push('/auth');
        }
      }, [router]);

      useEffect(() => {
        console.log(skins)
      }, [skins])

    // Create custom columns with edit functionality
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
    <div>
      <main className="bg-background flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <div className="flex items-center justify-between">
          <h1 className="mb-8 text-4xl font-bold">Skins</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/accessories">
                <Button>Accessories</Button>
            </Link>
            <Link href="/builds">
                <Button>Builds</Button>
            </Link>
            <Link href="/">
                <Button>Products</Button>
            </Link>
            <Link href="/configurator">
                <Button>Configurator</Button>
            </Link>
            <Link href="/players">
              <Button>Players</Button>
            </Link>
          </div>
        </div>

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
                  onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                    searchSkins(value);
                  }}
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
    </main>
    </div>
  )
}