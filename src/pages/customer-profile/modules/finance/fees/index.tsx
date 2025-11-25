import { useCallback, useEffect, useRef, useState } from "react";

import { FeeCharts, RangePickerDialog, TableContainer } from "@containers";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { TCursors } from "@types";
import { Autocomplete, Button, DataTable, Icon, TextField } from "@ui-kit";
import { calendarIcon } from "@utils";
import { endOfDay } from "date-fns";

import { feeEvents } from "./fees.consts";
import { useFeeHeaders } from "./hooks/useFeeHeaders";

export const Fees = () => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { headers } = useFeeHeaders();
  const [coins, setCoins] = useState([]);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateValues, setDateValues] = useState<string[]>([]);
  const [assetIds, setAssetIds] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [cursors, setCursors] = useState<TCursors>({
    previousCursor: null,
    nextCursor: null,
  });
  const [cursor, setCursor] = useState("");

  const handleCursorChange = (cursor: string) => {
    setCursor(cursor);
    canFetch.current = true;
  };

  const getFees = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/bo/api/customers/${id}/fees`, {
        filters: {
          ...(dateValues.length === 2
            ? { fromTimestamp: new Date(dateValues[0]), toTimestamp: endOfDay(dateValues[1]) }
            : {}),
          assetIds,
          orderActions: events,
        },
        ...(cursor ? { paging: { cursor } } : {}),
      });

      setItems(data.data);
      setCursors({ previousCursor: data.meta.previousCursor, nextCursor: data.meta.nextCursor });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, cursor, dateValues, assetIds, events]);

  const getCoins = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setCoins(
        data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { symbol: string }) => ({
            ...item,
            name: item.symbol,
            id: item.symbol,
          }))
      );
    } catch (err) {
      console.error("Error", err);
    }
  }, []);

  useEffect(() => {
    if (canFetch) {
      canFetch.current = false;
      void getFees();
    }
  }, [canFetch, getFees]);

  useEffect(() => {
    void getCoins();
  }, [getCoins]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-4">
        <div className="w-[260px]">
          <TextField
            placeholder="DD-MM-YYYY  DD-MM-YYYY"
            value={dateValues.length ? `${dateValues[0]} - ${dateValues[1]}` : ""}
            readOnly
            hideDetails
            appendInner={<Icon name={calendarIcon} />}
            onClick={() => setDateOpen(true)}
          />

          <RangePickerDialog
            title="Registration Date"
            open={dateOpen}
            onOpenChange={setDateOpen}
            value={dateValues}
            reset
            onConfirm={(val) => {
              if (Array.isArray(val)) {
                setDateValues(val);
                setDateOpen(false);
                canFetch.current = true;
              }
            }}
          />
        </div>

        <div className="w-[240px]">
          <Autocomplete
            placeholder="Assets"
            selectedItems={assetIds}
            items={coins}
            onChange={(val) => {
              setAssetIds(val);
              canFetch.current = true;
            }}
          />
        </div>

        <div className="w-[240px]">
          <Autocomplete
            placeholder="All Events"
            selectedItems={events}
            items={feeEvents}
            hasSearch={false}
            onChange={(val) => {
              setEvents(val);
              canFetch.current = true;
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <FeeCharts canFetch={canFetch.current} dateValues={dateValues} assetIds={assetIds} events={events} />

        <div className="-m-4">
          <TableContainer>
            <div className="overflow-auto">
              <DataTable headers={headers} items={items} loading={loading} hideFooter />
            </div>

            <div className="flex justify-end gap-3 pt-5">
              <Button
                className="w-[120px]"
                disabled={!cursors.previousCursor}
                onClick={() => handleCursorChange(cursors.previousCursor || "")}
              >
                <span className="inline-flex items-center gap-1 pr-2">
                  <Icon name={mdiChevronLeft} color="current" dense />
                  Previous
                </span>
              </Button>
              <Button
                className="w-[120px]"
                disabled={!cursors.nextCursor}
                onClick={() => handleCursorChange(cursors.nextCursor || "")}
              >
                <span className="inline-flex items-center gap-1 pl-3">
                  Next
                  <Icon name={mdiChevronRight} color="current" dense />
                </span>
              </Button>
            </div>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
