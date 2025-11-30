import { useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, AppHeader, DeleteDialog, TableContainer, UnsavedChangesDialog } from "@containers";
import { emptyProduct, ProductForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { Button, DataTable, TableFooter } from "@ui-kit";

import { useProductHeaders } from "./hooks/useProductHeaders";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { headers } = useProductHeaders();
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
  const setProduct = useStore((s) => s.setProduct);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setProduct(emptyProduct);
    setDialogMode("create");
    setDrawerType("product");
  };

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products", { params });

      console.log("data", data.items);

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
      void getProducts();
    }
  }, [navigate, getProducts]);

  return (
    <div>
      <AppHeader title="Products" MainButton={<Button onClick={handleAddClick}>Add Product</Button>} />

      <TableContainer>
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

      <UnsavedChangesDialog />
      <DeleteDialog title="Product" deleteUrl="products" onSuccess={getProducts} />
    </div>
  );
};
