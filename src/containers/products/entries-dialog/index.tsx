import { useCallback, useEffect, useRef, useState } from "react";

import { emptyEntry, EntryForm } from "@forms";
import { mdiClose } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { Button, DataTable, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Icon } from "@ui-kit";

import { CreateUpdateDialog } from "../../create-update-dialog";
import { DeleteEntryDialog } from "./delete-entry-dialog";
import { useEntryHeaders } from "./hooks/useEntryHeaders";

interface EntriesDialogProps {
  onSuccess: () => void;
}

export const EntriesDialog = ({ onSuccess }: EntriesDialogProps) => {
  const selectedEntriesProductId = useStore((s) => s.selectedEntriesProductId);
  const setSelectedEntriesProductId = useStore((s) => s.setSelectedEntriesProductId);
  const { headers } = useEntryHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    includeIsVariantOf: true,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const entry = useStore((s) => s.entry);
  const setEntry = useStore((s) => s.setEntry);
  const setDialogMode = useStore((s) => s.setDialogMode);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddEntry = () => {
    setEntry(emptyEntry);
    setDialogMode("create");
  };

  const getEntries = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/entries/by-product/${selectedEntriesProductId}`, { params });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, selectedEntriesProductId]);

  useEffect(() => {
    if (canFetch.current && selectedEntriesProductId) {
      canFetch.current = false;
      void getEntries();
    }
  }, [selectedEntriesProductId, getEntries]);

  return (
    <Dialog open={!!selectedEntriesProductId} onOpenChange={() => setSelectedEntriesProductId(null)}>
      <DialogContent className="min-w-[648px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="w-full">Product Entries</DialogTitle>

          <Button variant="ghost" tabIndex={-1} size="iconSmall" onClick={() => setSelectedEntriesProductId(null)}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button onClick={handleAddEntry}>Add Entry</Button>
            </div>

            <DataTable
              headers={headers}
              items={items}
              loading={loading}
              page={params.page}
              onPageChange={handlePageChange}
              itemsPerPage={params.pageSize}
              onItemsPerPageChange={handlePerPageChange}
              pageCount={totalPages}
              itemsTotalCount={totalRecords}
            />
          </div>
        </DialogDescription>
      </DialogContent>

      <CreateUpdateDialog open={!!entry} onOpenChange={() => setEntry(null)} title="Entry" dialogWidth={400}>
        <EntryForm
          onCancel={() => setEntry(null)}
          onSuccess={() => {
            setEntry(null);
            getEntries();
          }}
        />
      </CreateUpdateDialog>

      <DeleteEntryDialog onSuccess={getEntries} />
    </Dialog>
  );
};
