import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { OrderFormValues, ProductFormValues } from "@forms";
import { mdiMinus, mdiPlus } from "@mdi/js";
import { api } from "@services";
import { Button, Icon, ProgressCircular, TableFooter, TextField, Typography } from "@ui-kit";
import { cn } from "@utils";
import { searchIcon } from "@utils";
import { debounce } from "lodash";

interface OrderProductsProps {
  initialValue?: OrderFormValues["items"][number];
  value: ProductFormValues[];
  headersLength: number;
  errorMessage?: string;
  handleChange: (value: ProductFormValues[]) => void;
}

export const OrderProducts = ({ initialValue, value, headersLength, handleChange }: OrderProductsProps) => {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 5,
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const canFetchProduct = useRef(true);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductFormValues[]>([]);
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

  const getProduct = useCallback(
    async (productId: string) => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        handleChange([data]);
      } catch (err) {
        console.error(err);
      }
    },
    [handleChange]
  );

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products", {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          search: searchDebounced,
        },
      });
      setProducts(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, searchDebounced]);

  useEffect(() => {
    if (initialValue && canFetchProduct.current) {
      canFetchProduct.current = false;
      void getProduct(initialValue.productId);
    }
  }, [initialValue, getProduct]);

  useEffect(() => {
    void getProducts();
  }, [getProducts]);

  return (
    <div className="flex flex-col gap-4">
      <Button className="ml-auto w-[160px]" onClick={() => setOpen(!open)}>
        <Icon name={open ? mdiMinus : mdiPlus} color="current" dense />
        {open ? "Hide Products" : "Add Product"}
      </Button>

      {open && (
        <div className="flex flex-col gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <TextField
              label="Order products"
              placeholder="Search product name"
              value={searchValue}
              prependInner={<Icon name={searchIcon} className="mr-1" />}
              onChange={handleSearchChange}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center text-primary">
              <ProgressCircular indeterminate />
            </div>
          ) : (
            <div className="flex flex-col">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-md hover:bg-background-default",
                    product._id &&
                      value?.find((item) => item._id === product._id) &&
                      "border border-primary bg-background-default"
                  )}
                  onClick={() =>
                    product._id && value?.find((item) => item._id === product._id)
                      ? handleChange(value?.filter((item) => item._id !== product._id) || [])
                      : handleChange([...(value || []), product])
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
        </div>
      )}
    </div>
  );
};
