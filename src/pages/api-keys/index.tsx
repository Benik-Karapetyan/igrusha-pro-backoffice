import { useCallback, useEffect, useRef, useState } from "react";

import { TableContainer } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter, Typography } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { debounce } from "lodash";

import { ApiKeysToolbar } from "./components/ApiKeysToolbar";
import { useApiKeysHeaders } from "./hooks";

export const ApiKeysPage = () => {
  const { headers } = useApiKeysHeaders();
  const navigate = useNavigate();
  const toast = useToast();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    userId: "",
    from: "",
    to: "",
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [createdDateOpen, setCreatedDateOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [date, setDate] = useState<string | string[]>([]);

  const getApiUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/accessCredentials/period", { params });
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const debouncedUserIdChange = useRef(
    debounce((userId: string) => {
      setParams((prev) => ({ ...prev, userId }));
      canFetch.current = true;
    }, 500)
  ).current;

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedUserIdChange(value);
  };

  const handleDateChange = (date: string | string[]) => {
    setDate(date);
    setParams((prev) => ({
      ...prev,
      from: date[0] ? new Date(date[0]).toISOString() : "",
      to: date[1] ? new Date(date[1]).toISOString() : "",
    }));
    canFetch.current = true;
  };

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getApiUsers();
    }
  }, [navigate, getApiUsers, canFetch]);

  return (
    <>
      <div className="flex h-14 items-center gap-4 rounded-t-xl border-b bg-background-subtle px-4">
        <Typography variant="heading-3">API Keys</Typography>
      </div>

      <div className="flex items-center justify-between px-4 pt-4">
        <ApiKeysToolbar
          searchValue={searchValue}
          dateValue={date}
          isCalendarOpen={createdDateOpen}
          setCalendarOpen={setCreatedDateOpen}
          onSearchChange={onSearchChange}
          onCalendarChange={handleDateChange}
        />
      </div>

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
    </>
  );
};
