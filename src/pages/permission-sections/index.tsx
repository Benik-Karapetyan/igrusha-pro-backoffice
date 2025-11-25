import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyPermissionSection, PermissionSectionForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { usePermissionSectionHeaders } from "./hooks/usePermissionSectionHeaders";

export const PermissionSectionsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = usePermissionSectionHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    status: 1,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setPermissionSection = useStore((s) => s.setPermissionSection);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setPermissionSection(emptyPermissionSection);
    setDialogMode("create");
    setDialogs(["permissionSection"]);
  };

  const getPermissionSections = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/permissionSections/all", { params });
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!checkPermission("permission_sections_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getPermissionSections();
    }
  }, [checkPermission, navigate, getPermissionSections]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("permission_sections_create")}
        btnText="Add Permission Section"
        onAddClick={handleAddClick}
      />

      <TableContainer>
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
      </TableContainer>

      <CreateUpdateDialog title="Permission Section" dialogType="permissionSection">
        <PermissionSectionForm onSuccess={getPermissionSections} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Permission Section" updateUrl="permissionSections" onSuccess={getPermissionSections} />
      <DeleteDialog title="Permission Section" deleteUrl="permissionSections" onSuccess={getPermissionSections} />
    </div>
  );
};
