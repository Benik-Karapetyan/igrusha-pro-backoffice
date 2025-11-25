import { useEffect, useMemo, useState } from "react";

import { ResetPasswordDialog, UnsavedChangesDialog } from "@containers";
import { AdminUserForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const AdminUserPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { id } = useSearch({ from: "/auth/admin-users/admin-user" });
  const currentUserId = useStore((s) => s.auth.user?.id);
  const setDialogs = useStore((s) => s.setDialogs);
  const isModeEdit = useMemo(() => !!id, [id]);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    if (
      (id && +id === currentUserId) ||
      (!id && !checkPermission("admin_user_create")) ||
      (id && !checkPermission("admin_user_read"))
    )
      navigate({ to: "/" });
  }, [id, currentUserId, checkPermission, navigate]);

  return (
    <div className="p-5">
      <div className="rounded-xl border p-5">
        <AdminUserForm isModeEdit={isModeEdit} readOnly={readOnly} onReadOnlyChange={setReadOnly} />

        <ResetPasswordDialog />
        <UnsavedChangesDialog
          onCancel={() => setDialogs([])}
          onConfirm={() => {
            setDialogs([]);
            if (isModeEdit) setReadOnly(true);
            else navigate({ to: "/admin-users" });
          }}
        />
      </div>
    </div>
  );
};
