import { useMemo, useRef, useState } from "react";

import { DataTable, Icon, TableItem, TextField } from "@ui-kit";
import { searchIcon } from "@utils";
import { debounce } from "lodash";

import { TableContainer } from "../../table-container";
import { useTotalEarningHeaders } from "./hooks/useTotalEarningHeaders";

interface TotalEarningProps {
  items: TableItem[];
  loading: boolean;
}

export const TotalEarning = ({ items, loading }: TotalEarningProps) => {
  const { headers } = useTotalEarningHeaders();
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearchTermChange = useRef(
    debounce((value: string) => {
      setSearchValue(value);
    }, 500)
  ).current;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearchTermChange(value);
  };

  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((item) => (item.coinName as string).toLowerCase().includes(searchValue.toLowerCase()))
        : items,
    [searchValue, items]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[240px]">
        <TextField
          value={searchValue}
          placeholder="Search by Assets"
          hideDetails
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <TableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={filteredItems} loading={loading} hideFooter />
        </div>
      </TableContainer>
    </div>
  );
};
