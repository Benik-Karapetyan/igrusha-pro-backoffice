import { FC, useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, UnsavedChangesDialog } from "@containers";
import { emptyLevelFee, LevelFeeForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { Button, DataTable } from "@ui-kit";

import { TableContainer } from "../../table-container";
import { useLevelsFeeHeaders } from "./hooks/useLevelsFeeHeaders";

interface LevelsFeeProps {
  onDataReceived: (value: boolean) => void;
}

export const LevelsFee: FC<LevelsFeeProps> = ({ onDataReceived }) => {
  const drawerOpen = useStore((s) => s.drawerOpen);
  const setLevelFee = useStore((s) => s.setLevelFee);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const { headers } = useLevelsFeeHeaders();
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const handleCreateClick = () => {
    setLevelFee(emptyLevelFee);
    setDialogMode("create");
    setDrawerOpen(true);
  };

  const getLevelsFee = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/fees/all`, {
        params: {
          page: 1,
          pageSize: 100,
        },
      });
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getLevelsFee();
    }
  }, [getLevelsFee]);

  useEffect(() => {
    if (items.length) onDataReceived(true);
    else onDataReceived(false);
  }, [items.length, onDataReceived]);

  return (
    <div className="flex flex-col gap-4">
      <TableContainer>
        <div className="overflow-auto">
          <DataTable
            headers={headers}
            items={items}
            loading={loading}
            noDataContent={<Button onClick={handleCreateClick}>Create Level</Button>}
            hideFooter
          />
        </div>
      </TableContainer>

      <AppDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <LevelFeeForm onSuccess={getLevelsFee} />
      </AppDrawer>

      <UnsavedChangesDialog />
    </div>
  );
};
