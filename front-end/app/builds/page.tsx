'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { createBuildColumns } from '@/models/builds-table';
import { useBuilds } from '@/hooks/useBuilds';
import { BuildDialog, DeleteBuildDialog } from '@/models/dialogs';
import { BuildRead } from '@/types/prodcuts-base';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Builds() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [buildType, setBuildType] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<BuildRead | null>(null);
  const [editingBuild, setEditingBuild] = useState<BuildRead | null>(null);

  const { builds, pagination, loading, error, refetch } = useBuilds({
    page,
    limit: 10,
    buildType: buildType || undefined,
    search: search || undefined,
  });

  const { toast } = useToast();

  const handleEdit = (build: BuildRead) => {
    setEditingBuild(build);
    setDialogOpen(true);
  };

  const handleDelete = (build: BuildRead) => {
    setSelectedBuild(build);
    setDeleteDialogOpen(true);
  };

  const handleView = (build: BuildRead) => {
    // For now, just show a toast with build details
    toast({
      title: 'Build Details',
      description: `Viewing build: ${build.name}`,
    });
    // TODO: Implement detailed view modal or navigation to build detail page
  };

  const handleCreate = () => {
    setEditingBuild(null);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PC Builds</h1>
          <p className="text-muted-foreground">Manage your PC builds and configurations</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Build
        </Button>
      </div>

      <div className="flex items-center gap-4">
      
      
      </div>

      <DataTable
        columns={columns}
        data={builds}
        searchKey="name"
        searchPlaceholder="Search builds..."
        pagination={{
          total: pagination.total,
          totalPages: pagination.totalPages,
          currentPage: pagination.currentPage,
        }}
        onPageChange={setPage}
        renderActions={() => (
          <div className="flex items-center gap-2">
            {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          </div>
        )}
      />

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
    </div>
  );
}