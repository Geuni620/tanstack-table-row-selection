import type {
  Row as TRow,
  RowSelectionState,
  Table as TTable,
} from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToggleMutation } from '@/hook/useToggleMutation';
import { createRowSelection } from '@/utils/createRowSelection';

interface ColumnDataProps {
  id: number;
  task: string;
  statusId: number;
  statusName: string;
  notes: string;
  date: Date;
  done: boolean;
}

interface TableProps {
  table: TTable<ColumnDataProps>;
}

interface RowProps {
  row: TRow<ColumnDataProps>;
}

type TableComponentsProps = {
  data: ColumnDataProps[];
};

export const TableComponents: React.FC<TableComponentsProps> = ({ data }) => {
  const initialRowSelection = createRowSelection(data);
  const initialRowSelectionRef = useRef<null | RowSelectionState>(
    createRowSelection(data),
  );
  const [rowSelection, setRowSelection] = useState({});
  const toggleMutation = useToggleMutation();

  const columnHelper = createColumnHelper<ColumnDataProps>();
  const columns = [
    columnHelper.accessor('done', {
      header: ({ table }: TableProps) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: RowProps) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
    }),
    columnHelper.accessor('task', {
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Task
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: (props) => <p>{props.getValue()}</p>,
      size: 250,
    }),
    columnHelper.accessor('statusName', {
      header: 'Status',
      cell: (props) => <p>{props.getValue()}</p>,
      size: 100,
      enableSorting: false,
    }),
    columnHelper.accessor('notes', {
      header: 'Notes',
      size: 300,
      cell: (props) => <p>{props.getValue()}</p>,
      enableSorting: false,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      size: 200,
      cell: (props) => <p>{format(props.getValue(), 'yyyy-MM-dd HH:mm:ss')}</p>,
    }),
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  useEffect(() => {
    const newRowSelection = createRowSelection(data);
    setRowSelection(newRowSelection);
  }, [data]);

  // useEffect(() => {
  //   initialRowSelectionRef.current = createRowSelection(data);
  // }, [data]);

  console.log(
    'const',
    initialRowSelection,
    'ref',
    initialRowSelectionRef.current,
    'rowSelection',
    rowSelection,
  );

  return (
    <>
      {/* Table */}
      <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: `${header.getSize()}px`,
                    border: '1px solid gray',
                    textAlign: 'center',
                    padding: 0,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: `${cell.column.getSize()}px`,
                    border: '1px solid gray',
                    textAlign: 'center',
                    padding: '0.5rem 0.5rem',
                    height: '40px',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full items-center justify-end p-2">
        <Button
          onClick={() => toggleMutation.mutate({ selectedRow: rowSelection })}
          className="mt-2 text-end"
        >
          Done!
        </Button>
      </div>

      <div className="mt-[10px] flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'‹'}
        </Button>

        <div className="text-sm font-bold text-slate-500">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          {'›'}
        </Button>
      </div>
      <div>
        {table.getSelectedRowModel().flatRows.map((el) => {
          return <div key={el.id}>{JSON.stringify(el.original)}</div>;
        })}
      </div>
    </>
  );
};
