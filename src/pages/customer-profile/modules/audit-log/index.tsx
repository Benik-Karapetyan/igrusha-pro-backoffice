import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AuditLogDialog, AuditLogDialogMode, UnsavedChangesDialog } from "@containers";
import { emptyAuditLog } from "@forms";
import { useToast } from "@hooks";
import { TAuditLogTabValue } from "@routes";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ENUM_AUDIT_LOG_ACTION } from "@types";
import { Button, ProgressCircular, Tabs, TabsList, TabsTrigger } from "@ui-kit";
import { getErrorMessage, timeAgo } from "@utils";
import { format, parse } from "date-fns";
import { groupBy } from "lodash";

import { AuditLogItem } from "./audit-log-item.tsx";
import { IAuditLog, IAuditLogResponse } from "./audit-log.types.ts";
import { CustomerStatusIndicator } from "./customer-status-indicator.tsx";

export const AuditLog = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab, auditTab } = useSearch({ from: "/auth/customers/$id" });
  const setDialogs = useStore((s) => s.setDialogs);
  const canFetch = useRef(true);
  const [page, setPage] = useState(1);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<IAuditLogResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<AuditLogDialogMode>("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [selectedAuditLog, setSelectedAuditLog] = useState<IAuditLog | null>(null);
  const [formValues, setFormValues] = useState(emptyAuditLog);

  const groupedItems = useMemo(
    () =>
      auditLogs?.items
        ? groupBy(auditLogs?.items, (item) =>
            format(parse(item.createdAt, "yyyy-MM-dd HH:mm:ss", new Date()), "yyyy-MM-dd")
          )
        : [],
    [auditLogs?.items]
  );

  const handleTabClick = (value: TAuditLogTabValue) => {
    void navigate({
      to: "/customers/$id",
      params: { id: String(id) },
      search: { tab, auditTab: value },
    }).then(() => {
      setAuditLogs(null);
      canFetch.current = true;
    });
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    canFetch.current = true;
  };

  const handleEditReason = (item: IAuditLog) => {
    setDialogMode("reason");
    setDialogTitle("Reason");
    setDialogText("Select the appropriate reason for the update from the dropdown menu.");
    setSelectedAuditLog(item);
    setFormValues({
      reason: item.reason.reason,
      jiraLink: item.jiraLink.jiraLink,
      comment: item.comments[0],
    });
    setDialogOpen(true);
  };

  const handleEditJiraLink = (item: IAuditLog) => {
    setDialogMode("jiraLink");
    setDialogTitle("Jira link");
    setDialogText("Paste the new Jira link and confirm your update. Ensure the link is valid before saving.");
    setSelectedAuditLog(item);
    setFormValues({
      reason: item.reason.reason,
      jiraLink: item.jiraLink.jiraLink,
      comment: item.comments[0],
    });
    setDialogOpen(true);
  };

  const handleAddComment = (item: IAuditLog) => {
    setDialogMode("comment");
    setDialogTitle("Add comment");
    setDialogText("Add a comment about this customer below.");
    setSelectedAuditLog(item);
    setFormValues({ reason: item.reason.reason, jiraLink: item.jiraLink.jiraLink, comment: { id: 0, comment: "" } });
    setDialogOpen(true);
  };

  const handleEditComment = (item: IAuditLog, commentId: number) => {
    setDialogMode("comment");
    setDialogTitle("Edit comment");
    setDialogText("Edit your comment below. Make sure to save your changes when finished.");
    setSelectedAuditLog(item);
    const comment = item.comments.find((c) => c.id === commentId);
    if (comment) {
      setFormValues({
        reason: item.reason.reason,
        jiraLink: item.jiraLink.jiraLink,
        comment,
      });
    }
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setPage(1);
    setAuditLogs(null);
    canFetch.current = true;
  };

  const getAuditLogs = useCallback(async () => {
    try {
      setAuditLogsLoading(true);

      const action =
        !auditTab || auditTab === "blocked" ? ENUM_AUDIT_LOG_ACTION.Blocked : ENUM_AUDIT_LOG_ACTION.Deactivated;

      const { data } = await api.get(`/bo/api/customers/${id}/restricted-audit?action=${action}&page=${page}`);

      setAuditLogs({ ...auditLogs, ...data, items: [...(auditLogs?.items || []), ...(data.items || [])] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAuditLogsLoading(false);
    }
  }, [id, page, auditTab, toast, auditLogs]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getAuditLogs();
    }
  }, [getAuditLogs]);

  useEffect(() => {
    if (page !== 1 && auditLogs?.items.length && auditLogs.items.length > 10) {
      window.scrollTo({ top: window.scrollY + 300 });
    }
  }, [page, auditLogs?.items.length]);

  return (
    <Tabs defaultValue={auditTab || "blocked"}>
      <div className="border-b px-5 py-4">
        <TabsList>
          <TabsTrigger value="blocked" onClick={() => handleTabClick("blocked")}>
            Blocked
          </TabsTrigger>
          <TabsTrigger value="deactivated" onClick={() => handleTabClick("deactivated")}>
            Deactivated
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex flex-col gap-8 p-5">
        <CustomerStatusIndicator />

        {!auditLogs?.items?.length && !auditLogsLoading ? (
          <div className="flex h-[calc(100vh_-_366px)] min-h-[400px] items-center justify-center p-5">
            <div className="flex -translate-y-10 flex-col gap-2 text-center">
              <div className="font-semibold">No Audit Logs Yet</div>
              <div className="text-foreground-muted">Logs will appear here as changes happen.</div>
            </div>
          </div>
        ) : (
          Object.entries(groupedItems).map(([key, items], i) => {
            return (
              <div key={i} className="flex flex-col gap-6">
                <div className="text-base font-semibold text-foreground-muted">{timeAgo(Number(new Date(key)))}</div>

                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <AuditLogItem
                      key={item.id}
                      item={item}
                      onEditReason={handleEditReason}
                      onEditJiraLink={handleEditJiraLink}
                      onAddComment={handleAddComment}
                      onEditComment={handleEditComment}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}

        {auditLogsLoading && (
          <div className="flex justify-center text-primary">
            <ProgressCircular indeterminate />
          </div>
        )}

        {!!auditLogs?.items?.length && auditLogs?.currentPage !== auditLogs?.totalPages && (
          <div className="flex w-[530px] justify-center">
            <Button variant="ghost" size="small" className="w-[140px]" onClick={handleLoadMore}>
              Load more
            </Button>
          </div>
        )}
      </div>

      <AuditLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedAuditLog={selectedAuditLog}
        formValues={formValues}
        mode={dialogMode}
        title={dialogTitle}
        text={dialogText}
        onSuccess={handleSuccess}
      />

      <UnsavedChangesDialog
        onCancel={() => setDialogs([])}
        onConfirm={() => {
          setDialogs([]);
          setDialogOpen(false);
        }}
      />
    </Tabs>
  );
};
