import { useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, AppHeader, DeleteExpenseDialog, RangePickerDialog, TableContainer } from "@containers";
import { emptyExpense, ExpenseForm, expenseTypes } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { ENUM_EXPENSE_TYPE } from "@types";
import { Autocomplete, Button, DataTable, Icon, TableFooter, TextField, Typography } from "@ui-kit";
import { calendarIcon, formatCurrency } from "@utils";

import { useExpenseHeaders } from "./hooks/useExpenseHeaders";

export const ExpensesPage = () => {
  const navigate = useNavigate();
  const { headers } = useExpenseHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    types: [] as ENUM_EXPENSE_TYPE[],
    from: "",
    to: "",
  });
  const [dates, setDates] = useState<string[]>([]);
  const [datesOpen, setDatesOpen] = useState(false);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
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

  const handleTypesChange = (types: ENUM_EXPENSE_TYPE[]) => {
    setParams((prev) => ({ ...prev, types }));
    canFetch.current = true;
  };

  const handleDatesChange = (dates: string[]) => {
    setDates(dates);
    setDatesOpen(false);
    setParams((prev) => ({ ...prev, from: dates[0], to: dates[1] }));
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

      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page.toString());
      queryParams.append("pageSize", params.pageSize.toString());
      if (params.types.length) {
        params.types.forEach((type) => {
          queryParams.append("types", type);
        });
      }

      if (params.from && params.to) {
        queryParams.append("from", params.from);
        queryParams.append("to", params.to);
      }

      const { data } = await api.get("/expenses", { params: queryParams });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
      setTotalAmount(data.totalAmount);
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

      <div className="flex gap-4 p-4">
        <div className="w-[250px]">
          <Autocomplete
            placeholder="Expense Types"
            selectedItems={params.types}
            items={expenseTypes}
            hasSearch={false}
            onChange={handleTypesChange}
          />
        </div>

        <div className="w-[250px]">
          <TextField
            placeholder="DD.MM.YYYY  DD.MM.YYYY"
            value={dates.length ? `${dates[0]} - ${dates[1]}` : ""}
            readOnly
            hideDetails
            appendInner={<Icon name={calendarIcon} />}
            onClick={() => setDatesOpen(true)}
          />

          <RangePickerDialog
            title="Expense Creation Date"
            open={datesOpen}
            onOpenChange={setDatesOpen}
            value={dates}
            onConfirm={(val) => {
              if (Array.isArray(val)) {
                handleDatesChange(val);
              }
            }}
          />
        </div>
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
        <div className="flex justify-end gap-3 border bg-white px-6 py-4">
          <Typography variant="body-lg">Total Amount For Given Period:</Typography>
          <Typography variant="body-lg" color="error">
            {formatCurrency(totalAmount)}
          </Typography>
        </div>
      </div>

      <AppDrawer open={drawerType === "expense"} onOpenChange={(open) => setDrawerType(open ? "expense" : null)}>
        <ExpenseForm onSuccess={getExpenses} />
      </AppDrawer>

      <DeleteExpenseDialog onSuccess={getExpenses} />
    </div>
  );
};
