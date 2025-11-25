import { useCallback, useEffect, useRef, useState } from "react";

import { CreateUpdateDialog, DeleteDialog, StatusDialog, TableContainer } from "@containers";
import { RegionForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useRegionHeaders } from "./hooks/useRegionHeaders";

export const RegionsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useRegionHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const getRegions = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/locations/all", { params });
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
    if (!checkPermission("regions_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getRegions();
    }
  }, [checkPermission, navigate, getRegions]);

  return (
    <div>
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

      <CreateUpdateDialog title="Region" dialogType="region">
        <RegionForm onSuccess={getRegions} />
      </CreateUpdateDialog>
      <StatusDialog title="Region" updateUrl="locations" onSuccess={getRegions} />
      <DeleteDialog title="Region" deleteUrl="locations" onSuccess={getRegions} />
    </div>
  );
};
