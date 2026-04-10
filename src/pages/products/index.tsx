import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AppDrawer,
  AppHeader,
  DeleteDialog,
  EntriesDialog,
  ProductPublishDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyProduct, OrderForm, ProductForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button, DataTable, TableFooter } from "@ui-kit";

import { useProductHeaders } from "./hooks/useProductHeaders";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { page, pageSize } = useSearch({ from: "/auth/products" });
  const { headers } = useProductHeaders();

  const params = useMemo(
    () => ({
      page,
      pageSize,
      includeIsVariantOf: true,
    }),
    [page, pageSize]
  );

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const drawerType = useStore((s) => s.drawerType);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setProduct = useStore((s) => s.setProduct);

  const handlePageChange = (nextPage: number) => {
    void navigate({
      to: "/products",
      search: { page: nextPage, pageSize },
      replace: true,
    });
  };

  const handlePerPageChange = (nextPageSize: string | number) => {
    void navigate({
      to: "/products",
      search: { page: 1, pageSize: +nextPageSize },
      replace: true,
    });
  };

  const handleAddClick = () => {
    setProduct(emptyProduct);
    setDialogMode("create");
    setDrawerType("product");
  };

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products/back-office", { params });

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
    void getProducts();
  }, [getProducts]);

  return (
    <div>
      <AppHeader title="Products" MainButton={<Button onClick={handleAddClick}>Add Product</Button>} />

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

      <AppDrawer
        open={drawerType === "product"}
        onOpenChange={(open) => setDrawerType(open ? "product" : null)}
        size="xl"
      >
        <ProductForm onSuccess={getProducts} />
      </AppDrawer>

      <AppDrawer open={drawerType === "order"} onOpenChange={(open) => setDrawerType(open ? "order" : null)} size="lg">
        <OrderForm onSuccess={getProducts} />
      </AppDrawer>

      <EntriesDialog />

      <ProductPublishDialog onSuccess={getProducts} />

      <DeleteDialog title="Product" deleteUrl="products" onSuccess={getProducts} />

      <UnsavedChangesDialog />
    </div>
  );
};
