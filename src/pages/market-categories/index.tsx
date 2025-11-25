import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyMarketCategory, MarketCategoryForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useMarketCategoryHeaders } from "./hooks/useMarketCategoryHeaders";

export const MarketCategoriesPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useMarketCategoryHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setMarketCategory = useStore((s) => s.setMarketCategory);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setMarketCategory(emptyMarketCategory);
    setDialogMode("create");
    setDialogs(["marketCategory"]);
  };

  const getMarketCategories = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/marketCategories/all", { params });
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
    if (!checkPermission("market_category_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getMarketCategories();
    }
  }, [checkPermission, navigate, getMarketCategories]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("market_category_create")}
        btnText="Add Market Category"
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

      <CreateUpdateDialog title="Market Category" dialogType="marketCategory">
        <MarketCategoryForm onSuccess={getMarketCategories} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Market Category" updateUrl="marketCategories" onSuccess={getMarketCategories} />
      <DeleteDialog title="Market Category" deleteUrl="marketCategories" onSuccess={getMarketCategories} />
    </div>
  );
};
