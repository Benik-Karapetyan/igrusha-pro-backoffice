import { useCallback, useEffect, useRef, useState } from "react";

import { ConfirmDialog } from "@components";
import { AppDrawer, AppHeader, TableContainer, UnsavedChangesDialog } from "@containers";
import { CategoryForm, emptyCategory } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { Button, DataTable, TableFooter } from "@ui-kit";

import { useCategoryHeaders } from "./hooks/useCategoryHeaders";

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { headers } = useCategoryHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    includeIsVariantOf: true,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const drawerType = useStore((s) => s.drawerType);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setCategory = useStore((s) => s.setCategory);
  const selectedCategoryId = useStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useStore((s) => s.setSelectedCategoryId);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setCategory(emptyCategory);
    setDialogMode("create");
    setDrawerType("category");
  };

  const deleteCategory = async () => {
    try {
      await api.delete(`/categories/${selectedCategoryId}`);
      setSelectedCategoryId(null);
      getCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/categories", { params });

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
      void getCategories();
    }
  }, [navigate, getCategories]);

  return (
    <div>
      <AppHeader title="Categories" MainButton={<Button onClick={handleAddClick}>Add Category</Button>} />

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
        open={drawerType === "category"}
        onOpenChange={(open) => setDrawerType(open ? "category" : null)}
        size="xl"
      >
        <CategoryForm onSuccess={getCategories} />
      </AppDrawer>

      <UnsavedChangesDialog />
      <ConfirmDialog
        open={!!selectedCategoryId}
        onOpenChange={() => setSelectedCategoryId(null)}
        title="Delete Category"
        text="Are you sure you want to delete this category?"
        onCancel={() => setSelectedCategoryId(null)}
        confirmBtnText="Delete"
        confirmBtnVariant="critical"
        onConfirm={deleteCategory}
      />
    </div>
  );
};
