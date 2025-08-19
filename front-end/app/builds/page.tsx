'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createBuildColumns } from '@/models/builds-table';
import { useBuilds, useBuild } from '@/hooks/useBuilds';
import { BuildDialog } from '@/models/dialogs';
import BuildViewer from '@/models/dialogs/build-viewer';
import { BuildRead } from '@/types/prodcuts-base';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { useRouter } from 'next/navigation';
import WarningModal from '@/models/dialogs/warning-modal';
import { useToast } from '@/hooks/use-toast';
import { MainMenu } from '@/components/ui/menu';

export default function Builds() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [buildType, setBuildType] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingBuild, setEditingBuild] = useState<BuildRead | null>(null);
  const [viewingBuild, setViewingBuild] = useState<BuildRead | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<BuildRead | null>(null);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(1000000);
  const [showInSiteOnly, setShowInSiteOnly] = useState<boolean>(false);

  const { builds, pagination, loading, error, refetch, refetchWithOptions } = useBuilds({
    page,
    limit: 10,
    buildType: buildType || undefined,
    search: search || undefined,
    autoFetchOnSearchChange: false, 
    price_min: priceMin || undefined,
    price_max: priceMax || undefined,
    show_in_site_only: showInSiteOnly,
  });

  const { deleteBuild } = useBuild();

  const { toast } = useToast();


  const handleEdit = (build: BuildRead) => {
    setEditingBuild(build);
    setDialogOpen(true);
  };

  const handleDelete = (build: BuildRead) => {
    setBuildToDelete(build);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBuild = async () => {
    if (!buildToDelete) return;

    try {
      await deleteBuild(buildToDelete.id);
      toast({
        title: 'Success',
        description: 'Build deleted successfully',
      });
      await refetch();
      setIsDeleteModalOpen(false);
      setBuildToDelete(null);
    } catch (error) {
      console.error('Error deleting build:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete build',
        variant: 'destructive',
      });
      setIsDeleteModalOpen(false);
      setBuildToDelete(null);
    }
  };

  const handleView = (build: BuildRead) => {
    setViewingBuild(build);
    setViewDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingBuild(null);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleSearchAll = () => {
    const queryParams = {
      price_min: priceMin,
      price_max: priceMax,
      page: 1,
      search: search || undefined,
      buildType: buildType || undefined,
      show_in_site_only: showInSiteOnly,
    };
    setPage(1);
    refetchWithOptions(queryParams);
  };

  const handleSearchPrice = (from: number, to: number) => {
    setPriceMin(from);
    setPriceMax(to);
  };

  const handlePageChange = (newPage: number) => {    

    const queryParams = {
      page: newPage,
      search: search || undefined,
      buildType: buildType || undefined,
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
      show_in_site_only: showInSiteOnly,
    };
    
    setPage(newPage);
    refetchWithOptions(queryParams);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      router.push('/auth');
    }
  }, [router]);

  const columns = createBuildColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto py-6 space-y-6">
      <MainMenu />
      <div className="flex justify-end">
        <Button 
          variant="default"
          className="cursor-pointer "
          onClick={handleCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Build
        </Button>
      </div>
      <div className="mt-8 w-full">
        <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
          <DataTable
            columns={columns}
            data={builds}
            searchKey="name"
            searchPlaceholder="Search builds..."
            searchValue={search}
            onSearchChange={(value) => setSearch(value)}
            onSearchPrice={handleSearchPrice}
            onBuildTypeChange={(value) => setBuildType(value || '')}
            onButtonClick = {handleSearchAll}
            showFilter={true}
            pagination={{
              total: pagination.total,
              totalPages: pagination.totalPages,
              currentPage: pagination.currentPage,
              itemsPerPage: 10,
            }}
            onPageChange={handlePageChange}
            renderActions={() => (
              <div className="flex items-center gap-2">
                {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
              </div>
            )}
          />
        </div>
      </div>
      {/* Create/Edit Build Dialog */}
      <BuildDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        build={editingBuild}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBuildToDelete(null);
        }}
        onConfirm={confirmDeleteBuild}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the build "${buildToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Build Viewer Dialog */}
      <BuildViewer
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        build={viewingBuild}
      />
    </div>
  );
}