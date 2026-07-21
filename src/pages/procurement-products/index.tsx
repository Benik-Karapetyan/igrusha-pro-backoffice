import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AppDrawer,
  AppHeader,
  DeleteProcurementProductDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button, DataTable, TableFooter, TextField, Typography } from "@ui-kit";
import { formatCurrency } from "@utils";

import { ProcurementProductForm } from "../../forms/procurement-product-form";
import { emptyProcurementProduct } from "../../forms/procurement-product-form/procurement-product-form.consts";
import { useProcurementProductHeaders } from "./hooks/useProcurementProductHeaders";

export const ProcurementProductsPage = () => {
  const navigate = useNavigate();
  const { page, pageSize } = useSearch({ from: "/auth/procurement-products" });
  const [amdRate, setAmdRate] = useState(370);
  const { headers } = useProcurementProductHeaders(amdRate);
  const params = useMemo(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize]
  );
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{ price?: number; quantity?: number; deliveryInsideCost?: number }[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalAmount = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = typeof item.price === "number" ? item.price : 0;
        const quantity = typeof item.quantity === "number" ? item.quantity : 0;
        const deliveryInsideCost = typeof item.deliveryInsideCost === "number" ? item.deliveryInsideCost : 0;

        return sum + price * quantity + deliveryInsideCost;
      }, 0),
    [items]
  );
  const procurementProduct = useStore((s) => s.procurementProduct);
  const setProcurementProduct = useStore((s) => s.setProcurementProduct);
  const setDialogMode = useStore((s) => s.setDialogMode);

  const handlePageChange = (nextPage: number) => {
    void navigate({
      to: "/procurement-products",
      search: { page: nextPage, pageSize },
      replace: true,
    });
  };

  const handlePerPageChange = (nextPageSize: string | number) => {
    void navigate({
      to: "/procurement-products",
      search: { page: 1, pageSize: +nextPageSize },
      replace: true,
    });
  };

  const handleAddClick = () => {
    setProcurementProduct(emptyProcurementProduct);
    setDialogMode("create");
  };

  const getProcurementProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/procurement-products", { params });

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
    void getProcurementProducts();
  }, [getProcurementProducts]);

  console.log(items);

  return (
    <div>
      <AppHeader
        title="Procurement Products"
        MainButton={<Button onClick={handleAddClick}>Add Procurement Product</Button>}
      />

      <div className="flex p-4 pb-0">
        <TextField
          placeholder="Enter AMD rate"
          type="number"
          value={amdRate}
          onChange={(e) => setAmdRate(+e.target.value)}
        />
      </div>

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

      <div className="px-4">
        <div className="flex items-center justify-end gap-3 border bg-white px-6 py-4">
          <Typography variant="body-lg">Total Amount For Given Period:</Typography>
          <Typography variant="body-lg" color="success">
            {formatCurrency(totalAmount, "USD", "en-US")}
          </Typography>

          <div className="h-4 w-0.5 bg-black" />

          <Typography variant="body-lg" color="success">
            {formatCurrency(totalAmount * amdRate, "AMD", "hy-AM")}
          </Typography>
        </div>
      </div>

      <AppDrawer open={!!procurementProduct} onOpenChange={() => setProcurementProduct(null)} size="lg">
        <ProcurementProductForm onSuccess={getProcurementProducts} />
      </AppDrawer>

      <UnsavedChangesDialog />

      <DeleteProcurementProductDialog onSuccess={getProcurementProducts} />
    </div>
  );
};
