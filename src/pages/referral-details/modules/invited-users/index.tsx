import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { getErrorMessage, searchIcon } from "@utils";
import { debounce } from "lodash";
import { toast } from "sonner";

import { TableContainer } from "../../table-container";
import { useInvitedUserHeaders } from "./hooks/useInvitedUserHeaders.tsx";

export const InvitedUsers = () => {
  const { headers } = useInvitedUserHeaders();
  const { id } = useParams({ from: "/auth/referral/$id" });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearchTermChange = useRef(
    debounce((search: string) => {
      setParams((prev) => ({ ...prev, search }));
      canFetch.current = true;
    }, 500)
  ).current;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearchTermChange(value);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/referralUsers/${id}/referrals`, { params });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getUsers();
    }
  }, [getUsers]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[240px]">
        <TextField
          value={searchValue}
          placeholder="Search by UID, Referral ID"
          hideDetails
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={(e) => handleSearchChange(e.target.value)}
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
    </div>
  );
};
