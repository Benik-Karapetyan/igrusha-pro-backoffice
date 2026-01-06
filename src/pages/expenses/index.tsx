import { useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, AppHeader, DeleteExpenseDialog, TableContainer } from "@containers";
import { emptyExpense, ExpenseForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { Button, DataTable, TableFooter } from "@ui-kit";

import { useExpenseHeaders } from "./hooks/useExpenseHeaders";

export const ExpensesPage = () => {
  const navigate = useNavigate();
  const { headers } = useExpenseHeaders();
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
  const setExpense = useStore((s) => s.setExpense);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setExpense(emptyExpense);
    setDialogMode("create");
    setDrawerType("expense");
  };

  const getExpenses = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/expenses", { params });

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
      void getExpenses();
    }
  }, [navigate, getExpenses]);

  return (
    <div>
      <AppHeader title="Expenses" MainButton={<Button onClick={handleAddClick}>Add Expense</Button>} />

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

      <AppDrawer open={drawerType === "expense"} onOpenChange={(open) => setDrawerType(open ? "expense" : null)}>
        <ExpenseForm onSuccess={getExpenses} />
      </AppDrawer>

      <DeleteExpenseDialog onSuccess={getExpenses} />
    </div>
  );
};
