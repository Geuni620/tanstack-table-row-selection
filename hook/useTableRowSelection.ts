import { OnChangeFn, type RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';

export const useTableRowSelection = (
  initialRowSelection: RowSelectionState,
) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  console.log('initialRowSelection', initialRowSelection);

  const value =
    Object.keys(rowSelection).length > 0 ? rowSelection : initialRowSelection;

  const onRowSelectionChange = (data: OnChangeFn<RowSelectionState>) => {
    if (typeof data === 'function') {
      setRowSelection(data(value) as unknown as RowSelectionState);
    }
  };

  console.log('rowSelection hooks', rowSelection);

  return {
    rowSelection: value,
    setRowSelection,
    onRowSelectionChange,
  };
};
