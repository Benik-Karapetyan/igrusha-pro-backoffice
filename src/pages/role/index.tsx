import { useEffect, useMemo, useState } from "react";

import { UnsavedChangesDialog } from "@containers";
import { RoleForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const RolePage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { id } = useSearch({ from: "/auth/roles/role" });
  const setDialogs = useStore((s) => s.setDialogs);
  const isModeEdit = useMemo(() => !!id, [id]);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    if ((!id && !checkPermission("roles_create")) || (id && !checkPermission("roles_read"))) navigate({ to: "/" });
  }, [id, checkPermission, navigate]);

  return (
    <div className="p-5">
      <div className="rounded-xl border p-5">
        <RoleForm readOnly={readOnly} isModeEdit={isModeEdit} onReadOnlyChange={setReadOnly} />

        <UnsavedChangesDialog
          onCancel={() => setDialogs([])}
          onConfirm={() => {
            setDialogs([]);
            if (isModeEdit) setReadOnly(true);
            else navigate({ to: "/roles" });
          }}
        />
      </div>
    </div>
  );
};
