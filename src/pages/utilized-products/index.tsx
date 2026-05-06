import { useCallback, useEffect, useMemo, useState } from "react";

import { AppDrawer, AppHeader, DeleteUtilizedProductDialog, TableContainer, UnsavedChangesDialog } from "@containers";
import { UtilizedProductForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useUtilizedProductHeaders } from "./hooks/useUtilizedProductHeaders";

export const UtilizedProductsPage = () => {
  const navigate = useNavigate();
  const { page, pageSize } = useSearch({ from: "/auth/utilized-products" });
  const { headers } = useUtilizedProductHeaders();
  const params = useMemo(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize]
  );
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const selectedUtilizedProduct = useStore((s) => s.selectedUtilizedProduct);
  const setSelectedUtilizedProduct = useStore((s) => s.setSelectedUtilizedProduct);
  // const setDialogMode = useStore((s) => s.setDialogMode);

  const handlePageChange = (nextPage: number) => {
    void navigate({
      to: "/utilized-products",
      search: { page: nextPage, pageSize },
      replace: true,
    });
  };

  const handlePerPageChange = (nextPageSize: string | number) => {
    void navigate({
      to: "/utilized-products",
      search: { page: 1, pageSize: +nextPageSize },
      replace: true,
    });
  };

  // const handleAddClick = () => {
  //   setSelectedUtilizedProduct(emptyUtilizedProduct);
  //   setDialogMode("create");
  // };

  const getUtilizedProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/utilized-products", { params });

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
    void getUtilizedProducts();
  }, [getUtilizedProducts]);

  return (
    <div>
      <AppHeader
        title="Utilized Products"
        // MainButton={<Button onClick={handleAddClick}>Add Utilized Product</Button>}
      />

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

      <AppDrawer open={!!selectedUtilizedProduct} onOpenChange={() => setSelectedUtilizedProduct(null)}>
        <UtilizedProductForm onSuccess={getUtilizedProducts} />
      </AppDrawer>

      <DeleteUtilizedProductDialog onSuccess={getUtilizedProducts} />

      <UnsavedChangesDialog />
    </div>
  );
};
