import { FC, useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, UnsavedChangesDialog } from "@containers";
import { CustomFeeForm, emptyLevelFee } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { Button, DataTable } from "@ui-kit";

import { TableContainer } from "../../table-container";
import { useCustomFeeHeaders } from "./hooks/useCustomFeeHeaders";

interface CustomFeeProps {
  onDataReceived: (value: boolean) => void;
}

export const CustomFee: FC<CustomFeeProps> = ({ onDataReceived }) => {
  const drawerOpen = useStore((s) => s.drawerOpen);
  const setLevelFee = useStore((s) => s.setLevelFee);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const { headers } = useCustomFeeHeaders();
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const handleCreateClick = () => {
    setLevelFee(emptyLevelFee);
    setDialogMode("create");
    setDrawerOpen(true);
  };

  const getCustomFee = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/customFees/all`, {
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
      void getCustomFee();
    }
  }, [getCustomFee]);

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
            noDataContent={<Button onClick={handleCreateClick}>Create Custom Fee</Button>}
            hideFooter
          />
        </div>
      </TableContainer>

      <AppDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <CustomFeeForm onSuccess={getCustomFee} />
      </AppDrawer>

      <UnsavedChangesDialog />
    </div>
  );
};
