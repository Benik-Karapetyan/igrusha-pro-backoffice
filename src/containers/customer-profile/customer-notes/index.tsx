import { useCallback, useEffect, useRef, useState } from "react";

import { CustomerNoteForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { ICustomerNote } from "@types";
import { ProgressCircular, Typography } from "@ui-kit";

import { CustomerNoteItem } from "./customer-note-item";

export const CustomerNotes = () => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const currentUser = useStore((s) => s.auth.user);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<ICustomerNote[]>([]);

  const getNotes = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/customers/${id}/notes`);
      setNotes(data.items);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
    <div className="flex flex-col gap-6 rounded-xl border bg-background-subtle p-4">
      <Typography variant="heading-3">Notes</Typography>

      <div className="flex flex-col gap-5">
        <div className="flex max-h-[172px] flex-col gap-2 overflow-auto">
          {notes.map((note, i) => (
            <CustomerNoteItem key={i} note={note} />
          ))}
        </div>

        {currentUser && <CustomerNoteForm customerId={+id} authorEmail={currentUser.email} onSuccess={getNotes} />}
      </div>
    </div>
  );
};
