import { useCallback, useEffect, useRef, useState } from "react";

import { OnOffRampNoteForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { ICustomerNote } from "@types";
import { ProgressCircular, Typography } from "@ui-kit";

import { CustomerNoteItem } from "../../customer-profile/customer-notes/customer-note-item";

export const OnOffRampHistoryNotes = () => {
  const currentUser = useStore((s) => s.auth.user);
  const selectedOnOffRampTransaction = useStore((s) => s.selectedOnOffRampTransaction);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<ICustomerNote[]>([]);

  const getNotes = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/payment/orders/${selectedOnOffRampTransaction?.id}/notes`);
      setNotes(data.items);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  }, [selectedOnOffRampTransaction?.id]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getNotes();
    }
  }, [getNotes]);

  return loading ? (
    <div className="flex justify-center text-primary">
      <ProgressCircular indeterminate />
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      <Typography variant="heading-3">Notes</Typography>

      <div className="flex flex-col gap-5">
        <div className="flex max-h-[calc(100vh_-_40rem)] flex-col gap-2 overflow-auto">
          {notes.map((note, i) => (
            <CustomerNoteItem key={i} note={note} />
          ))}
        </div>

        {currentUser && selectedOnOffRampTransaction && (
          <OnOffRampNoteForm
            orderId={selectedOnOffRampTransaction.id}
            authorEmail={currentUser.email}
            onSuccess={getNotes}
          />
        )}
      </div>
    </div>
  );
};
