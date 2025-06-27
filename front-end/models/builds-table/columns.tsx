import { BuildRead } from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface BuildColumnsProps {
  onEdit: (build: BuildRead) => void;
  onDelete: (build: BuildRead) => void;
  onView: (build: BuildRead) => void;
}

export const createBuildColumns = ({ onEdit, onDelete, onView }: BuildColumnsProps): ColumnDef<BuildRead>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'build_type',
    header: 'Type',
    cell: ({ row }) => {
      const buildType = row.getValue('build_type') as string;
      return buildType ? buildType.charAt(0).toUpperCase() + buildType.slice(1) : '—';
    },
  },
  {
    accessorKey: 'build_price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.getValue('build_price') as number;
      return price ? `$${price.toFixed(2)}` : '—';
    },
  },
  {
    accessorKey: 'cpu',
    header: 'CPU',
    cell: ({ row }) => {
      const cpu = row.original.cpu;
      return cpu ? `${cpu.attrs.brand} ${cpu.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'gpu',
    header: 'GPU',
    cell: ({ row }) => {
      const gpu = row.original.gpu;
      return gpu ? `${gpu.attrs.brand} ${gpu.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'motherboard',
    header: 'Motherboard',
    cell: ({ row }) => {
      const motherboard = row.original.motherboard;
      return motherboard ? `${motherboard.attrs.brand} ${motherboard.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'ram',
    header: 'RAM',
    cell: ({ row }) => {
      const ram = row.original.ram;
      return ram ? `${ram.attrs.brand} ${ram.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'storage',
    header: 'Storage',
    cell: ({ row }) => {
      const storage = row.original.storage;
      return storage ? `${storage.attrs.brand} ${storage.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'psu',
    header: 'PSU',
    cell: ({ row }) => {
      const psu = row.original.psu;
      return psu ? `${psu.attrs.brand} ${psu.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'case',
    header: 'Case',
    cell: ({ row }) => {
      const case_ = row.original.case;
      return case_ ? `${case_.attrs.brand} ${case_.attrs.model}` : '—';
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return format(date, 'MMM dd, yyyy');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const build = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(build.id.toString())}
            >
              Copy build ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(build)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(build)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit build
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(build)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete build
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 