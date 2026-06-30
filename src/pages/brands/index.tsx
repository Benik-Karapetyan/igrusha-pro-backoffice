import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppDrawer,
  AppHeader,
  BrandPublishDialog,
  DeleteBrandDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { BrandForm, emptyBrand } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { Button, DataTable, TableFooter } from "@ui-kit";

import { useBrandHeaders } from "./hooks/useBrandHeaders";

export const BrandsPage = () => {
  const navigate = useNavigate();
  const { headers } = useBrandHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const drawerType = useStore((s) => s.drawerType);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setBrand = useStore((s) => s.setBrand);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setBrand(emptyBrand);
    setDialogMode("create");
    setDrawerType("brand");
  };

  const getBrands = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/brands/back-office", { params });

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
    if (canFetch.current) {
      canFetch.current = false;
      void getBrands();
    }
  }, [navigate, getBrands]);

  return (
    <div>
      <AppHeader title="Brands" MainButton={<Button onClick={handleAddClick}>Add Brand</Button>} />

      <TableContainer itemsLength={items.length}>
        <div className="overflow-auto">
          <DataTable headers={headers} items={items} loading={loading} hideFooter />
        </div>

        <table className="w-full">
          <TableFooter
            headersLength={headers.length}
            page={params.page}
            onPageChange={handlePageChange}
            itemsPerPage={params.pageSize}
            onItemsPerPageChange={handlePerPageChange}
            pageCount={totalPages}
            itemsTotalCount={totalRecords}
          />
        </table>
      </TableContainer>

      <AppDrawer open={drawerType === "brand"} onOpenChange={(open) => setDrawerType(open ? "brand" : null)} size="xl">
        <BrandForm onSuccess={getBrands} />
      </AppDrawer>

      <BrandPublishDialog onSuccess={getBrands} />

      <DeleteBrandDialog onSuccess={getBrands} />

      <UnsavedChangesDialog />
    </div>
  );
};
