import { useToast } from "@hooks";

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  startIn?: FileSystemHandle;
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
}

interface Window {
  showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
}

export const useExportToCSV = () => {
  const toast = useToast();

  const exportToCSV = async (data: FileSystemWriteChunkType, filename: string) => {
    if ("showSaveFilePicker" in window) {
      try {
        const options = {
          suggestedName: `${filename}.csv`,
          types: [
            {
              description: "CSV Files",
              accept: { "text/csv": [".csv"] },
            },
          ],
        };
        const fileHandle = await (window as Window).showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
        return true;
      } catch (err) {
        if (typeof (err as { message: string }).message === "string") {
          toast.info((err as { message: string }).message);
        }
        return false;
      }
    } else {
      alert("Your browser doesn't support file export");
    }
  };

  return {
    exportToCSV,
  };
};
