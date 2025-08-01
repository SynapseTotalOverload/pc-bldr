'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createBuildColumns } from '@/models/builds-table';
import { useBuilds } from '@/hooks/useBuilds';
import { BuildDialog, DeleteBuildDialog } from '@/models/dialogs';
import BuildViewer from '@/models/dialogs/build-viewer';
import { BuildRead } from '@/types/prodcuts-base';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/data-table';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-provider';

export default function Builds() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [buildType, setBuildType] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<BuildRead | null>(null);
  const [editingBuild, setEditingBuild] = useState<BuildRead | null>(null);
  const [viewingBuild, setViewingBuild] = useState<BuildRead | null>(null);
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


  const handleEdit = (build: BuildRead) => {
    setEditingBuild(build);
    setDialogOpen(true);
  };

  const handleDelete = (build: BuildRead) => {
    setSelectedBuild(build);
    setDeleteDialogOpen(true);
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

  const handleBuildTypeChange = (newBuildType: string | null) => {
    const queryParams = {
      buildType: newBuildType || undefined,
      page: 1,
      search: search || undefined,
      price_min: priceMin,
      price_max: priceMax,
      show_in_site_only: showInSiteOnly,
    };

    setBuildType(newBuildType || '');
    setPage(1);
    refetchWithOptions(queryParams);
  };

  const handleShowInSiteOnlyChange = (checked: boolean) => {
    const queryParams = {
      show_in_site_only: checked,
      page: 1,
      search: search || undefined,
      buildType: buildType || undefined,
      price_min: priceMin,
      price_max: priceMax,
    };

    setShowInSiteOnly(checked);
    setPage(1);
    refetchWithOptions(queryParams);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PC Builds</h1>
          <p className="text-muted-foreground">Manage your PC builds and configurations</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-in-site-only"
              checked={showInSiteOnly}
              onCheckedChange={handleShowInSiteOnlyChange}
            />
            <Label htmlFor="show-in-site-only" className="text-sm font-normal">
              Show only site builds
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/accessories">
                <Button>Accessories</Button>
            </Link>
            <Link href="/skins">
                <Button>Skins</Button>
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
            <Button 
              variant="default"
              className="cursor-pointer"
              onClick={handleCreate}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Build
            </Button>
          </div>
        </div>
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
      <DeleteBuildDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        build={selectedBuild}
        onSuccess={handleSuccess}
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