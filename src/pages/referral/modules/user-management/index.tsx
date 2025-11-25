import { useCallback, useEffect, useRef, useState } from "react";

import { BlockReferralLinkDialog } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { getErrorMessage, searchIcon } from "@utils";
import { debounce } from "lodash";

import { TableContainer } from "../../table-container";
import { useUserManagementHeaders } from "./hooks/useUserManagementHeaders";

export const UserManagement = () => {
  const { headers } = useUserManagementHeaders();
  const toast = useToast();
  const canFetch = useRef(true);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

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

  const getReferralUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/referralUsers/all`, { params });
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

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getReferralUsers();
    }
  }, [getReferralUsers]);

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

      <BlockReferralLinkDialog onSuccess={getReferralUsers} />
    </div>
  );
};
