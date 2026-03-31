import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { mdiChevronDown } from "@mdi/js";
import { api } from "@services";
import { Button, Icon, ProgressCircular, TableFooter, TextField, Typography } from "@ui-kit";
import { cn, searchIcon } from "@utils";
import debounce from "lodash/debounce";

import { ProductFormValues } from "../product-form.consts";

interface RelatedProductsProps {
  name: string;
  value: string[];
  headersLength: number;
  errorMessage?: string;
  handleChange: (value: string[]) => void;
}

export const RelatedProducts = ({
  name,
  value,
  headersLength,
  errorMessage = "",
  handleChange,
}: RelatedProductsProps) => {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductFormValues[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const debouncedSearchChange = useRef(
    debounce((searchTerm: string) => {
      setSearchDebounced(searchTerm);
      canFetch.current = true;
    }, 1000)
  ).current;

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value);
    debouncedSearchChange(value);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const getRelatedProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products/back-office", {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          search: searchDebounced,
        },
      });
      setRelatedProducts(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, searchDebounced]);

  useEffect(() => {
    void getRelatedProducts();
  }, [getRelatedProducts]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div className="w-[calc(100%_/_3_-_0.68rem)]">
          <TextField
            label="Related products"
            placeholder="Search product name"
            name={name}
            value={searchValue}
            errorMessage={errorMessage}
            prependInner={<Icon name={searchIcon} className="mr-1" />}
            onChange={handleSearchChange}
          />
        </div>

        <Button variant="outline" onClick={() => setOpen(!open)}>
          <Icon
            name={mdiChevronDown}
            color="current"
            dense
            className={cn("transition-transform duration-300", open && "rotate-180")}
          />
          <div className="w-[107px]">{open ? "Hide Related" : "Show Related"}</div>
        </Button>
      </div>

      {open && (
        <>
          {loading ? (
            <div className="flex items-center justify-center text-primary">
              <ProgressCircular indeterminate />
            </div>
          ) : (
            <div className="flex flex-col">
              {relatedProducts.map((product) => (
                <div
                  key={product._id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-md hover:bg-background-default",
                    product._id && value?.includes(product._id) && "border border-primary bg-background-default"
                  )}
                  onClick={() =>
                    product._id && value?.includes(product._id)
                      ? handleChange(value?.filter((id) => id !== product._id) || [])
                      : handleChange([...(value || []), product._id || ""])
                  }
                >
                  <img src={product.gallery[0]} alt="" className="h-[120px] w-[120px] rounded-md object-cover" />
                  <Typography>{product.name.en}</Typography>
                </div>
              ))}
            </div>
          )}

          <TableFooter
            headersLength={headersLength}
            page={params.page}
            onPageChange={handlePageChange}
            itemsPerPage={params.pageSize}
            onItemsPerPageChange={handlePerPageChange}
            pageCount={totalPages}
            itemsTotalCount={totalRecords}
          />
        </>
      )}
    </div>
  );
};
