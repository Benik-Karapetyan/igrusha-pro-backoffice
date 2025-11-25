import { useCallback, useEffect, useRef, useState } from "react";

import { AccountCard, AccountsViewMenu } from "@containers";
import { api } from "@services";
import { TAccount } from "@types";
import { Button, ProgressCircular, Typography } from "@ui-kit";

export const AccountsPage = () => {
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TAccount[]>([]);
  const [hiddenAccounts, setHiddenAccounts] = useState<number[]>([]);

  const handleViewChange = (index: number) => {
    if (hiddenAccounts.includes(index)) {
      const newHiddenAccounts = hiddenAccounts.filter((a) => a !== index);
      setHiddenAccounts(newHiddenAccounts);
    } else {
      setHiddenAccounts([...hiddenAccounts, index]);
    }
  };

  const getAccounts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/fin/api/accounts`);
      setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getAccounts();
    }
  }, [getAccounts]);

  return (
    <>
      <div className="flex h-14 items-center justify-between gap-4 rounded-tl-xl border-b bg-background-subtle px-4">
        <Typography variant="heading-3">Accounts</Typography>

        {!!items.length && (
          <div className="flex gap-4">
            <AccountsViewMenu items={items} hiddenItems={hiddenAccounts} onItemClick={handleViewChange} />
            <Button>Create Account</Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-10 text-primary">
          <ProgressCircular indeterminate />
        </div>
      ) : !items.length ? (
        <div className="flex h-[calc(100%_-_3.5rem)] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-fit p-[5px]">
              <img src="../../no-data.svg" alt="no data" className="h-[90px] w-[90px]" />
            </div>

            <Typography variant="body-lg" color="secondary" className="font-normal">
              No Data
            </Typography>

            <Button onClick={() => {}}>Create Account</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 p-4">
          {items.map((account, i) => (
            <AccountCard
              key={i}
              title={account.name}
              id={account.number}
              to={`/accounts/${account.type}/${account.number}?accountName=${account.name}`}
              active={account.accountCategory === "Active"}
              hidden={hiddenAccounts.includes(i)}
              onHide={() => setHiddenAccounts([...hiddenAccounts, i])}
            />
          ))}
        </div>
      )}
    </>
  );
};
