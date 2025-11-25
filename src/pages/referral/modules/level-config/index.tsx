import { useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, UnsavedChangesDialog } from "@containers";
import { LevelingSystemForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { ISelectItem } from "@types";

import { LevelingSystemCard } from "./leveling-system-card";
import { VerificationTriggersCard } from "./verification-triggers-card";

export const LevelConfig = () => {
  const [levelingSystemOpen, setLevelingSystemOpen] = useState(false);
  const setDialogs = useStore((s) => s.setDialogs);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const getLevels = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/userLevels/all`, {
        params: {
          page: 1,
          pageSize: 100,
        },
      });
      setItems(data.items.reverse().map((item: ISelectItem, i: number) => ({ ...item, name: `Level ${i + 1}` })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getLevels();
    }
  }, [getLevels]);

  return (
    <div className="flex gap-4">
      <LevelingSystemCard loading={loading} items={items} onSetLeveling={() => setLevelingSystemOpen(true)} />

      <VerificationTriggersCard />

      <AppDrawer open={levelingSystemOpen} onOpenChange={setLevelingSystemOpen}>
        <LevelingSystemForm
          levels={items}
          onCancel={() => setLevelingSystemOpen(false)}
          onSuccess={() => {
            setLevelingSystemOpen(false);
            getLevels();
          }}
        />
      </AppDrawer>

      <UnsavedChangesDialog
        onConfirm={() => {
          setDialogs([]);
          setLevelingSystemOpen(false);
        }}
      />
    </div>
  );
};
