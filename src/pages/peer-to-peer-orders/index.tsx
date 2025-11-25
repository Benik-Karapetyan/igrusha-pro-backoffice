import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { AppHeader, FilterBar, TableContainer } from "@containers";
import { emptyPeerToPeerOrderFilters, PeerToPeerOrderFiltersForm, PeerToPeerOrderFiltersFormValues } from "@forms";
import { api } from "@services";
import { DataTable, Icon, TextField } from "@ui-kit";
import { TableFooter } from "@ui-kit";
import { searchIcon } from "@utils";
import { debounce } from "lodash";

import { usePeerToPeerOrderHeaders } from "./hooks/usePeerToPeerOrderHeaders";

export const PeerToPeerOrdersPage = () => {
  const { headers } = usePeerToPeerOrderHeaders();
  const [filters, setFilters] = useState(emptyPeerToPeerOrderFilters);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
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

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
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

  const handleFilter = useCallback((peerToPeerFilters: PeerToPeerOrderFiltersFormValues) => {
    setFilters(peerToPeerFilters);
    setParams((prev) => ({ ...prev, ...peerToPeerFilters }));
    canFetch.current = true;
  }, []);

  const getPeerToPeerOrders = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/bo/api/customers/all`, params);

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
      void getPeerToPeerOrders();
    }
  }, [getPeerToPeerOrders]);

  return (
    <div>
      <AppHeader title="P2P Orders" />

      <div className="flex items-center justify-between p-4 pb-0">
        <div className="w-[340px]">
          <TextField
            value={searchValue}
            placeholder="Search by Order ID, Offer ID, Customer ID"
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={handleSearchChange}
          />
        </div>

        <FilterBar filtersCount={0}>
          <PeerToPeerOrderFiltersForm filters={filters} onFilter={handleFilter} />
        </FilterBar>
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
