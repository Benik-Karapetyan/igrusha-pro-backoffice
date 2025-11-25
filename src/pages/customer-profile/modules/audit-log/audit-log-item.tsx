import { FC, useEffect, useMemo, useRef, useState } from "react";

import { banReasons, closeReasons } from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiOpenInNew, mdiPencilOutline } from "@mdi/js";
import { ENUM_AUDIT_LOG_ACTION } from "@types";
import { Button, Icon } from "@ui-kit";
import { cn } from "@utils";

import { IAuditLog } from "./audit-log.types";

interface AuditLogItemProps {
  item: IAuditLog;
  onEditReason: (item: IAuditLog) => void;
  onEditJiraLink: (item: IAuditLog) => void;
  onAddComment: (item: IAuditLog) => void;
  onEditComment: (item: IAuditLog, commentId: number) => void;
}

export const AuditLogItem: FC<AuditLogItemProps> = ({
  item,
  onEditReason,
  onEditJiraLink,
  onAddComment,
  onEditComment,
}) => {
  const { checkPermission } = useCheckPermission();
  const reasonModifiedContainerRef = useRef<HTMLDivElement>(null);
  const jiraLinkModifiedContainerRef = useRef<HTMLDivElement>(null);
  const commentModifiedContainerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const { action, createdBy, createdAt, reason, jiraLink, comments } = item;

  const auditLogItemData = useMemo(() => {
    switch (action) {
      case ENUM_AUDIT_LOG_ACTION.Blocked:
        return {
          type: "blocked",
          reason: banReasons.find((item) => item.id === reason.reason)?.name,
        };
      case ENUM_AUDIT_LOG_ACTION.Deactivated:
        return {
          type: "deactivated",
          reason: closeReasons.find((item) => item.id === reason.reason)?.name,
        };
    }
  }, [action, reason.reason]);

  useEffect(() => {
    const updateWidth = () => {
      const reasonWidth = reasonModifiedContainerRef.current?.offsetWidth || 0;
      const jiraWidth = jiraLinkModifiedContainerRef.current?.offsetWidth || 0;
      const commentWidth = commentModifiedContainerRef.current?.offsetWidth || 0;
      if (reasonWidth || jiraWidth || commentWidth) setItemWidth(Math.max(reasonWidth, jiraWidth, commentWidth) + 200);
      else setItemWidth(530);
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="flex flex-col gap-2" style={{ width: itemWidth }}>
      <div className="flex items-center justify-between gap-5">
        <div className="text-xs font-bold">
          {createdBy} <span className="font-normal text-foreground-muted">{auditLogItemData.type}</span> the customer on{" "}
          {createdAt}
        </div>

        {checkPermission("customer_profile_audit_log_create") && (
          <Button size="small" onClick={() => onAddComment(item)}>
            Add Comment
          </Button>
        )}
      </div>

      {reason ? (
        <div className="flex flex-col gap-3 rounded-2xl border bg-button-segment-background-selected p-4">
          <div className="flex items-center justify-between gap-5 text-foreground">
            <h4 className="text-md font-bold">Reason</h4>

            <div className="flex items-center gap-1">
              {reason.modifiedAt && reason.modifiedBy ? (
                <div ref={reasonModifiedContainerRef} className="whitespace-nowrap text-sm text-foreground">
                  Modified on {reason.modifiedAt}, by {reason.modifiedBy}
                </div>
              ) : null}

              {checkPermission("customer_profile_audit_log_update") && (
                <Button
                  variant="icon"
                  size="icon"
                  className="bg-button-segment-background-selected"
                  onClick={() => onEditReason(item)}
                >
                  <Icon name={mdiPencilOutline} color="current" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm">{auditLogItemData.reason || "-"}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border bg-button-segment-background-selected p-4">
        <div className="flex items-center justify-between gap-5 text-foreground">
          <h4 className="text-md font-bold">Jira Link</h4>

          <div className="flex items-center gap-1">
            {jiraLink.modifiedAt && jiraLink.modifiedBy ? (
              <div ref={jiraLinkModifiedContainerRef} className="whitespace-nowrap text-sm text-foreground">
                Modified on {jiraLink.modifiedAt}, by {jiraLink.modifiedBy}
              </div>
            ) : null}

            {checkPermission("customer_profile_audit_log_update") && (
              <Button
                variant="icon"
                size="icon"
                className="bg-button-segment-background-selected"
                onClick={() => onEditJiraLink(item)}
              >
                <Icon name={mdiPencilOutline} color="current" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Icon name={mdiOpenInNew} color="current" className="opacity-50" />
          <a
            className={cn("w-[464px] overflow-hidden text-ellipsis whitespace-nowrap text-foreground-muted", {
              "pointer-events-none": !jiraLink.jiraLink,
            })}
            href={jiraLink.jiraLink || ""}
          >
            {jiraLink.jiraLink || "There is no Jira link"}
          </a>
        </div>
      </div>

      {comments.map((comment, index) => (
        <div
          key={comment.id}
          className="flex flex-col gap-3 rounded-2xl border bg-button-segment-background-selected p-4"
        >
          <div className="flex items-center justify-between gap-5 text-foreground">
            <h4 className="text-md font-bold">Comment #{index + 1}</h4>

            <div className="flex items-center gap-1">
              {comment.modifiedAt && comment.modifiedBy ? (
                <div ref={commentModifiedContainerRef} className="whitespace-nowrap text-sm text-foreground">
                  Modified on {comment.modifiedAt}, by {comment.modifiedBy}
                </div>
              ) : comment.createdAt && comment.createdBy ? (
                <div ref={commentModifiedContainerRef} className="whitespace-nowrap text-sm text-foreground">
                  Created on {comment.createdAt}, by {comment.createdBy}
                </div>
              ) : null}

              {checkPermission("customer_profile_audit_log_update") && (
                <Button
                  variant="icon"
                  size="icon"
                  className="bg-button-segment-background-selected"
                  onClick={() => onEditComment(item, comment.id)}
                >
                  <Icon name={mdiPencilOutline} color="current" />
                </Button>
              )}
            </div>
          </div>

          <p className="break-all text-sm">{comment.comment}</p>
        </div>
      ))}
    </div>
  );
};
