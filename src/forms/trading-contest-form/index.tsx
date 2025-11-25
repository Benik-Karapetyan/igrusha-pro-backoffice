import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { ContestRankingExplanationDialog, RangePickerDialog } from "@containers";
import { useToast } from "@hooks";
import { mdiCalendar, mdiInformation, mdiPlus } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import {
  Autocomplete,
  Button,
  Chip,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Icon,
  Select,
  Textarea,
  TextField,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { cn, deleteIcon, formatScientificToFullNumber, getErrorMessage } from "@utils";
import { uploadIcon } from "@utils";
import axios from "axios";
import { format } from "date-fns";
import { isEqual, omit } from "lodash";

import {
  emptyTradingContest,
  emptyTradingContestReward,
  TradingContestFormSchema,
  TradingContestFormValues,
} from "./trading-contest-form.consts";

interface TradingContestFormProps {
  onSuccess: () => void;
}

export const TradingContestForm = ({ onSuccess }: TradingContestFormProps) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.selectedTradingContest) || emptyTradingContest;
  const setDefaultValues = useStore((s) => s.setSelectedTradingContest);
  const dialogMode = defaultValues.name === "" ? "create" : "update";
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: TradingContestFormSchema,
    },
    onSubmit: ({ value }) => {
      const maxRankHasError = value.rewards.some((reward, i, arr) => +reward.maxRank <= +arr[i - 1]?.maxRank);

      if (!maxRankHasError) {
        if (dialogMode === "create") createTradingContest(value);
        else updateTradingContest(value);
      }
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [durationOpen, setDurationOpen] = useState(false);
  const [tradingPairs, setTradingPairs] = useState([]);
  const [coins, setCoins] = useState([]);
  const [contestRankingExplanationOpen, setContestRankingExplanationOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setDialogs(["unsavedChanges"]);
    } else {
      setDefaultValues(null);
    }
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, setValue: (value: string) => void) => {
    const file = e.target.files?.[0];

    if (file) {
      setUploadedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setValue(tempUrl);
    }
  };

  const createTradingContest = async (requestData: TradingContestFormValues) => {
    try {
      setLoading(true);

      if (uploadedFile) {
        const {
          data: { fileUri, presignedUrl },
        } = await api.post("/bo/api/files/presigned-url", {
          purpose: 1,
          fileType: uploadedFile?.type,
          folder: "trading-contests",
        });

        if (presignedUrl) {
          const unsignedClient = axios.create();

          await unsignedClient.put(presignedUrl, uploadedFile, {
            headers: {
              "Content-Type": uploadedFile?.type,
            },
          });
        }

        await api.post("/bo/api/tradeContests", {
          ...omit(requestData, "duration", "rewards", "imageTag"),
          imageTag: fileUri,
          isActive: true,
          startDate: new Date(requestData.duration[0]),
          endDate: new Date(requestData.duration[1]),
          distributionRule: {
            places: requestData.rewards.map((reward, i) => ({ ...reward, placeNumber: i + 1 })),
          },
          prize: requestData.rewards.reduce((total, reward) => total + (Number(reward.rewardPart) || 0), 0),
        });
      }

      setDefaultValues(null);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateTradingContest = async (requestData: TradingContestFormValues) => {
    try {
      setLoading(true);

      if (uploadedFile) {
        const {
          data: { fileUri, presignedUrl },
        } = await api.post("/files/presigned-url", {
          purpose: 1,
          fileType: uploadedFile?.type,
          folder: "trading-contests",
        });

        if (presignedUrl) {
          const unsignedClient = axios.create();

          await unsignedClient.put(presignedUrl, uploadedFile, {
            headers: {
              "Content-Type": uploadedFile?.type,
            },
          });
        }

        await api.put("/bo/api/tradeContests/", {
          ...omit(requestData, "duration", "rewards", "imageTag"),
          imageTag: fileUri,
          isActive: true,
          startDate: new Date(requestData.duration[0]),
          endDate: new Date(requestData.duration[1]),
          distributionRule: {
            places: requestData.rewards.map((reward, i) => ({ ...reward, placeNumber: i + 1 })),
          },
          prize: requestData.rewards.reduce((total, reward) => total + (Number(reward.rewardPart) || 0), 0),
        });
      } else {
        await api.put("/bo/api/tradeContests/", {
          ...omit(requestData, "duration", "rewards"),
          isActive: true,
          startDate: new Date(requestData.duration[0]),
          endDate: new Date(requestData.duration[1]),
          distributionRule: {
            places: requestData.rewards.map((reward, i) => ({ ...reward, placeNumber: i + 1 })),
          },
          prize: requestData.rewards.reduce((total, reward) => total + (Number(reward.rewardPart) || 0), 0),
        });
      }

      setDefaultValues(null);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getTradingPairs = async () => {
    try {
      const { data } = await api.get("/bo/api/markets/all?page=1&pageSize=10000");
      setTradingPairs(
        data.data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { name: string }) => ({ ...item, id: item.name }))
      );
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getCoins = async () => {
    try {
      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setCoins(
        data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { symbol: string }) => ({ ...item, name: item.symbol, id: item.symbol }))
      );
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    void getTradingPairs();
    void getCoins();
  }, []);

  return (
    <form className="flex h-full flex-col" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>{dialogMode === "create" ? "Create Contest" : "Update Contest"}</DrawerTitle>
      </DrawerHeader>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-6 pt-3">
        <div className="flex flex-col gap-4 border-b border-dashed pb-4">
          <Field name="name">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                ref={firstInputRef}
                label="Name"
                placeholder="Type"
                name={name}
                value={value}
                autoFocus
                hideDetails
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>

          <Field name="description">
            {({ name, state: { value, meta }, handleChange }) => (
              <Textarea
                label="Description"
                placeholder="Type"
                name={name}
                value={value}
                maxCharacters={80}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>

          <Field name="imageTag">
            {({ state: { value, meta }, handleChange }) => (
              <div className="flex flex-col gap-1.5">
                <Typography variant="heading-5" color="secondary">
                  Image
                </Typography>

                {value && <img src={value} alt="Contest" className="h-[126px] w-[345px] rounded-md object-cover" />}

                <div
                  className={cn(
                    "flex flex-col items-center gap-4 rounded-xl border border-dashed px-2 py-4",
                    meta.errors[0] && "border-error-primary"
                  )}
                >
                  <Icon name={uploadIcon} />

                  <div className="flex items-center gap-1">
                    <Typography variant="heading-4">Drag & drop files or</Typography>

                    <Button
                      type="button"
                      variant="text"
                      className="underline underline-offset-4"
                      onClick={handleBrowseFile}
                    >
                      Browse File
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpeg,.jpg,.png,.pdf,.mp4"
                    onChange={(e) => handleFileChange(e, handleChange)}
                  />

                  <Typography variant="body-sm" color="secondary">
                    JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
                  </Typography>
                </div>

                {meta.errors[0] && <span className="text-xs text-error-primary">{meta.errors[0]}</span>}
              </div>
            )}
          </Field>

          <Field name="duration">
            {({ state: { value, meta }, handleChange }) => (
              <>
                <TextField
                  label="Duration"
                  placeholder="DD-MM-YYYY  DD-MM-YYYY"
                  value={value.length ? `${value[0]} - ${value[1]}` : ""}
                  readOnly
                  hideDetails
                  errorMessage={meta.errors[0] || ""}
                  appendInner={<Icon name={mdiCalendar} />}
                  onClick={() => setDurationOpen(true)}
                />

                <RangePickerDialog
                  title="Duration"
                  open={durationOpen}
                  onOpenChange={setDurationOpen}
                  value={value}
                  minDate={format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd")}
                  ignoreStartDate={dialogMode === "update"}
                  onConfirm={(val) => {
                    if (Array.isArray(val)) {
                      handleChange(val);
                      setDurationOpen(false);
                    }
                  }}
                />
              </>
            )}
          </Field>

          <Field name="markets">
            {({ state: { value, meta }, handleChange }) => (
              <Autocomplete
                label="Trading Pairs"
                placeholder="Choose"
                selectedItems={value}
                items={tradingPairs}
                errorMessage={meta.errors[0] || ""}
                onChange={(val) => handleChange(val)}
              />
            )}
          </Field>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Typography variant="heading-4">Reward</Typography>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Icon name={mdiInformation} dense />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <TooltipArrow />

                  <Typography variant="body-sm" color="inverse" className="max-w-[300px] whitespace-normal">
                    Define prize distribution by ranking positions. Set specific rewards for individual places (e.g.,
                    1st place) or ranges (e.g., 2nd-5th place). Amounts are per participant.
                  </Typography>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col gap-4">
            <Field name="prizeSymbol">
              {({ state: { value, meta }, handleChange }) => (
                <Select
                  label="Reward Currency"
                  placeholder="Choose Asset"
                  value={value}
                  items={coins}
                  hideDetails
                  hasSearch
                  errorMessage={meta.errors[0] || ""}
                  onValueChange={(val) => handleChange(val)}
                />
              )}
            </Field>

            <div className="flex items-center justify-between">
              <Typography variant="heading-4">How Reward Ranks Work</Typography>

              <Button
                type="button"
                variant="ghost"
                size="iconXSmall"
                onClick={() => setContestRankingExplanationOpen(true)}
              >
                <Icon name={mdiInformation} dense />
              </Button>
            </div>

            <Field name="rewards" mode="array">
              {({ state: { value }, pushValue, removeValue }) => (
                <div className="flex flex-col">
                  {value.map((_reward, i) => (
                    <div className="flex items-center gap-2" key={i}>
                      <div className="items- flex gap-2">
                        <div className="w-16">
                          <Field name={`rewards[${i}].placeNumber`}>
                            {() => (
                              <div className="flex flex-col gap-1.5">
                                <Typography variant="body-sm" color="secondary" className="font-semibold">
                                  Place
                                </Typography>
                                <Chip title={String(i + 1)} className="w-9" />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="w-44">
                          <Field name={`rewards[${i}].maxRank`}>
                            {({ name, state: { value: inputValue, meta }, handleChange }) => (
                              <TextField
                                label="Max Rank"
                                placeholder="Max Rank"
                                type="number"
                                name={name}
                                value={formatScientificToFullNumber(inputValue)}
                                errorMessage={
                                  typeof inputValue === "number" &&
                                  inputValue <= +form.state.values.rewards[i - 1]?.maxRank
                                    ? "Max rank must be greater than previous place ones"
                                    : meta.errors[0] || ""
                                }
                                onChange={({ target: { value: inputValue } }) => {
                                  handleChange(inputValue ? +inputValue : "");
                                  form.validateAllFields("change");
                                }}
                              />
                            )}
                          </Field>
                        </div>

                        <Field name={`rewards[${i}].rewardPart`}>
                          {({ name, state: { value, meta }, handleChange }) => (
                            <TextField
                              label="Amount"
                              placeholder="Amount"
                              type="number"
                              name={name}
                              value={formatScientificToFullNumber(value)}
                              errorMessage={meta.errors[0] || ""}
                              onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                            />
                          )}
                        </Field>
                      </div>

                      {value.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="iconSmall"
                          className="mb-1"
                          onClick={() => removeValue(i)}
                        >
                          <Icon name={deleteIcon} />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="text"
                    className="ml-auto"
                    onClick={() => pushValue(emptyTradingContestReward)}
                  >
                    <Icon name={mdiPlus} color="current" />
                    Add
                  </Button>
                </div>
              )}
            </Field>
          </div>
        </div>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit} loading={loading}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>

      <ContestRankingExplanationDialog
        open={contestRankingExplanationOpen}
        onOpenChange={setContestRankingExplanationOpen}
      />
    </form>
  );
};
