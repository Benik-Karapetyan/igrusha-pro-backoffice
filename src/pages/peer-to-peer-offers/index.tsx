import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { AppHeader, FilterBar, TableContainer } from "@containers";
import { PeerToPeerOfferSearch } from "@containers";
import { emptyPeerToPeerOfferFilters, PeerToPeerOfferFiltersForm, PeerToPeerOfferFiltersFormValues } from "@forms";
import { api } from "@services";
import { ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM } from "@types";
import { DataTable } from "@ui-kit";
import { TableFooter } from "@ui-kit";
import { debounce } from "lodash";

import { usePeerToPeerOfferHeaders } from "./hooks/usePeerToPeerOfferHeaders";

export const PeerToPeerOffersPage = () => {
  const { headers } = usePeerToPeerOfferHeaders();
  const [filters, setFilters] = useState(emptyPeerToPeerOfferFilters);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: {
      term: ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM.customerOrOfferId,
      value: "",
    },
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const debouncedSearchTermChange = useRef(
    debounce((value: string) => {
      setParams((prev) => ({ ...prev, search: { ...prev.search, value } }));
      canFetch.current = true;
    }, 500)
  ).current;

  const handleSearchTermChange = (term: ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM) => {
    setParams((prev) => ({ ...prev, search: { ...prev.search, term } }));
  };

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

  const handleFilter = useCallback((peerToPeerFilters: PeerToPeerOfferFiltersFormValues) => {
    setFilters(peerToPeerFilters);
    setParams((prev) => ({ ...prev, ...peerToPeerFilters }));
    canFetch.current = true;
  }, []);

  const getPeerToPeerOffers = useCallback(async () => {
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
      void getPeerToPeerOffers();
    }
  }, [getPeerToPeerOffers]);

  return (
    <div>
      <AppHeader title="P2P Offers" />

      <div className="flex items-center justify-between p-4 pb-0">
        <PeerToPeerOfferSearch
          searchTerm={params.search.term}
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
          handleSearchTermChange={handleSearchTermChange}
        />

        <FilterBar filtersCount={0}>
          <PeerToPeerOfferFiltersForm filters={filters} onFilter={handleFilter} />
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
