import { useCallback, useEffect, useRef, useState } from "react";

import { TableContainer } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { Button, DataTable, Skeleton, Typography } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { useCustomerApiKeyHeaders } from "./hooks";

interface ApiKeysProps {
  identityId?: string;
}

export const ApiKeys = ({ identityId }: ApiKeysProps) => {
  const toast = useToast();
  const { headers } = useCustomerApiKeyHeaders();
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [freezeLoading, setFreezeLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isFrozen, setIsFrozen] = useState(false);

  const getApiKeyDetails = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/accessCredentials/api-keys?userId=${identityId}`);

      setData(data?.items);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [identityId, toast]);

  const updateFreezeStatus = useCallback(async () => {
    try {
      setFreezeLoading(true);
      await api.put(`/bo/api/accessCredentials/${isFrozen ? "unfreeze" : "freeze"}`, { userId: identityId });
      setIsFrozen((prev) => !prev);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFreezeLoading(false);
    }
  }, [identityId, isFrozen, toast]);

  const getFreezeStatus = useCallback(async () => {
    try {
      setFreezeLoading(true);
      const { data } = await api.get(`/bo/api/accessCredentials/customer-status?userId=${identityId}`);

      setIsFrozen(data?.isFrozen);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFreezeLoading(false);
    }
  }, [identityId, toast]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getFreezeStatus();
      void getApiKeyDetails();
    }
  }, [getApiKeyDetails, getFreezeStatus]);

  return (
    <>
      <div className="flex justify-end p-4 pb-0">
        {freezeLoading ? (
          <Skeleton className="h-9 w-40" />
        ) : (
          <Button
            variant={freezeLoading ? "ghost" : isFrozen ? "default" : "critical"}
            onClick={updateFreezeStatus}
            loading={freezeLoading}
          >
            <Typography variant="heading-4" color="inverse">
              {isFrozen ? "Unfreeze API Creation" : "Freeze API Creation"}
            </Typography>
          </Button>
        )}
      </div>

      <TableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={data} loading={loading} hideFooter />
        </div>
      </TableContainer>
    </>
  );
};
