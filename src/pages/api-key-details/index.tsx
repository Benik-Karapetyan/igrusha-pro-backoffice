import { useCallback, useEffect, useRef, useState } from "react";

import { ApiKeyDeactivationDialog, AppDrawer } from "@containers";
import { ApiKeyForm } from "@forms";
import { useToast } from "@hooks";
import { TApiKeyDetailsTabValue } from "@routes";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ENUM_SCOPES } from "@types";
import {
  Button,
  DataTable,
  Icon,
  ProgressCircular,
  TableItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
} from "@ui-kit";
import { arrowLeftIcon, fillMissingNumbers, getErrorMessage } from "@utils";

import { useApiKeyDetailsHeaders } from "./hooks";
import { ItemProps, OverView } from "./modules";
import { ApiKeysOverViewTableContainer } from "./modules/api-keys-overview-table-container";

export const ApiKeyDetailsPage = () => {
  const canFetch = useRef(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { headers } = useApiKeyDetailsHeaders();

  const setDialogs = useStore((s) => s.setDialogs);

  const { id } = useParams({ from: "/auth/api-keys/$id" });
  const { key } = useSearch({ from: "/auth/api-keys/$id" });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<TableItem[]>([]);
  const [item, setItem] = useState<ItemProps>({
    id: "",
    userId: "",
    key: "",
    name: "",
    scopes: [],
    createdAt: "",
    modifiedAt: "",
    lastActivity: "",
    status: 1,
    rps: 0,
  });

  const [params] = useState({
    page: 1,
    pageSize: 100,
    userId: id,
  });

  const handleTabClick = (tab: TApiKeyDetailsTabValue) => {
    navigate({ to: "/api-keys/$id", search: { tab, key }, params: { id: String(id) } });
  };

  const getApiKeyDetails = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/accessCredentials/api-keys", { params });
      const res = data.items.filter((item: ItemProps) => item.key === key)?.[0] || data.items[0];

      const filledScopes = fillMissingNumbers(res?.scopes || []);

      const scopeDetails = filledScopes.map((scope: number) => {
        return { name: ENUM_SCOPES[scope] };
      });

      setScope(scopeDetails);
      setItem(res);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [params, toast, key]);

  const updateStatus = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.patch(
        `/bo/api/accessCredentials/${item?.status === 1 ? "deactivate" : "activate"}?key=${key}`
      );

      if (data?.success === true) {
        setItem({ ...item, status: item?.status === 1 ? 2 : 1 });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [item, toast, key]);

  const handleStatusChange = () => {
    setDialogs([]);
    void updateStatus();
  };

  const handleRpsChangeSuccess = async (rps: number) => {
    setDrawerOpen(false);
    setItem({ ...item, rps });
  };

  useEffect(() => {
    if (id && canFetch.current) {
      canFetch.current = false;
      void getApiKeyDetails();
    }
  }, [getApiKeyDetails, id]);

  return (
    <div className="h-full rounded-l-xl border bg-background-default shadow-[0px_0px_6px_0px_#0E121B29]">
      <Tabs defaultValue="overview">
        <div className="flex items-center gap-4 rounded-tl-xl border-b bg-background-subtle px-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Icon name={arrowLeftIcon} className="cursor-pointer" onClick={() => navigate({ to: "/api-keys" })} />
              <Typography variant="heading-3">API Keys</Typography>
            </div>

            <div className="h-5 border-l border-stroke-divider"></div>
          </div>

          <TabsList>
            <TabsTrigger value="overview" onClick={() => handleTabClick("overview")}>
              Overview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4" style={{ marginLeft: "auto" }}>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              <Typography variant="heading-4">RPS Settings</Typography>
            </Button>

            {item && (
              <Button
                variant={item.status === 1 ? "critical" : "default"}
                onClick={() => setDialogs(["apiKeyDetailsStatus"])}
                loading={loading}
              >
                <Typography variant="heading-4" color="inverse">
                  {item.status === 1 ? "Deactivate" : "Activate"}
                </Typography>
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="overview" className="p-4">
          {loading ? (
            <div className="flex min-h-52 w-full items-center justify-center text-primary">
              <ProgressCircular indeterminate />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <OverView item={item} />

              {scope && (
                <ApiKeysOverViewTableContainer>
                  <div className="overflow-auto">
                    <DataTable headers={headers} items={scope} loading={loading} hideFooter />
                  </div>
                </ApiKeysOverViewTableContainer>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AppDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <ApiKeyForm
          defaultValues={{ newRPS: item.rps, key: key }}
          onSuccess={handleRpsChangeSuccess}
          onCancel={() => setDrawerOpen(false)}
        />
      </AppDrawer>

      <ApiKeyDeactivationDialog onSubmit={handleStatusChange} status={item?.status} loading={loading} />
    </div>
  );
};
