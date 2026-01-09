import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { AppHeader, TableContainer } from "@containers";
import { api } from "@services";
import { Button, DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { searchIcon } from "@utils";
import { debounce } from "lodash";

import { useUserHeaders } from "./hooks/useUserHeaders";

export const UsersPage = () => {
  const { headers } = useUserHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearchTermChange = useRef(
    debounce((searchTerm: string) => {
      setParams((prev) => ({ ...prev, searchTerm }));
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

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/users", { params });

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
      void getUsers();
    }
  }, [getUsers]);

  const handleAddFacebookUserClick = async () => {
    try {
      await api.post("/users", {
        firstName: "Order From",
        lastName: "Facebook",
        email: "benik.karapetyan1+1@gmail.com",
        phone: "+37491006262",
        password: "Benik006262$",
        addresses: [],
        termsAndConditions: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInstagramUserClick = async () => {
    try {
      await api.post("/users", {
        firstName: "Order From",
        lastName: "Instagram",
        email: "benik.karapetyan1+2@gmail.com",
        phone: "+37491006262",
        password: "Benik006262$",
        addresses: [],
        termsAndConditions: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhoneUserClick = async () => {
    try {
      await api.post("/users", {
        firstName: "Order From",
        lastName: "Phone",
        email: "benik.karapetyan1+3@gmail.com",
        phone: "+37491006262",
        password: "Benik006262$",
        addresses: [],
        termsAndConditions: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AppHeader
        title="Users"
        MainButton={<Button onClick={handleAddFacebookUserClick}>Add Facebook User</Button>}
        SecondaryButton={<Button onClick={handleAddInstagramUserClick}>Add Instagram User</Button>}
      />

      <Button onClick={handleAddPhoneUserClick}>Add Phone User</Button>

      <div className="flex items-center justify-between p-4 pb-0">
        <TextField
          value={searchValue}
          placeholder="Search by UID, Full Name, Email"
          className="w-[222px]"
          hideDetails
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={handleSearchChange}
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
    </div>
  );
};
