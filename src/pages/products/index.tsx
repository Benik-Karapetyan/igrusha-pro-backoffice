import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyProduct, ProductForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

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
  const setDialogs = useStore((s) => s.setDialogs);
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
    setDialogs(["product"]);
  };

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/products/all", { params });
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
      <AppToolbar btnText="Add Product" onAddClick={handleAddClick} />

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

      <CreateUpdateDialog title="Product" dialogType="product">
        <ProductForm onSuccess={getProducts} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Product" updateUrl="products" onSuccess={getProducts} />
      <DeleteDialog title="Product" deleteUrl="products" onSuccess={getProducts} />
    </div>
  );
};
