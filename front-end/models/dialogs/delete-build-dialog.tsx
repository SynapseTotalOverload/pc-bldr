'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BuildRead } from '@/types/prodcuts-base';
import { useBuild } from '@/hooks/useBuilds';
import { useToast } from '@/hooks/use-toast';

interface DeleteBuildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  build: BuildRead | null;
  onSuccess?: () => void;
}

export function DeleteBuildDialog({ open, onOpenChange, build, onSuccess }: DeleteBuildDialogProps) {
  const { deleteBuild, loading } = useBuild();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!build) return;

    try {
      await deleteBuild(build.id);
      toast({
        title: 'Success',
        description: 'Build deleted successfully',
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete build',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the build{' '}
            <strong>{build?.name}</strong> and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 