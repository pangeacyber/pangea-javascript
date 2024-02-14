import { create } from "zustand";
import { ObjectStore } from "../../types";

export interface DownloadPopoverStore {
  download: ObjectStore.ObjectResponse | undefined;
  onDone:
    | ((password: string, algo: string) => Promise<boolean | void>)
    | undefined;
  onCancel: (() => void) | undefined;
}

export const useDownloadPopover = create<DownloadPopoverStore>(() => ({
  download: undefined,
  onDone: undefined,
  onCancel: undefined,
}));

export const getPasswordForDownload = (
  download: ObjectStore.ObjectResponse,
  onDone: (password: string, algo: string) => Promise<boolean | void>,
  onCancel: (() => void) | undefined
) => {
  useDownloadPopover.setState({ download, onDone, onCancel });
};
