'use client';

import { FormEvent, useRef, useState } from 'react';

import { TableComponents } from '@/components/table';
import { Input } from '@/components/ui/input';
import { useTableDataGetQuery } from '@/hook/useTableDataGetQuery';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchCondition, setSearchCondition] = useState<string>('');

  const tableList = useTableDataGetQuery({
    searchCondition,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearchCondition(inputRef.current?.value || '');
    tableList.refetch();
  };
  if (tableList.isLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen">
      <div className="mx-auto w-[900px] pb-20 pt-10">
        <form
          onSubmit={onSubmit}
          className="mb-2 flex items-center justify-between gap-2"
        >
          <Input
            ref={inputRef}
            className="w-[20%]"
            type="text"
            placeholder="Task name"
          />
        </form>
        <TableComponents data={tableList.data?.list} />
      </div>
    </div>
  );
}
