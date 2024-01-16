import { create } from "zustand";
import { ObjectStore } from "../../types";

export type FileUploadState = "waiting" | "uploading" | "uploaded" | "error";
export interface FileUpload {
  file: File;
  state: FileUploadState;
  message?: string;
  parent?: ObjectStore.ObjectResponse;
}

export interface UploadPopoverStore {
  uploads: Record<string, FileUpload>;
}

export const useUploadPopover = create<UploadPopoverStore>(() => ({
  uploads: {},
}));

export const uploadFiles = (
  files: FileList,
  parent: ObjectStore.ObjectResponse | undefined = undefined
) => {
  const uploads = { ...useUploadPopover.getState().uploads };

  for (var i = 0; i < files.length; i++) {
    const file: File = files[i];
    const id_ = crypto.randomUUID();
    uploads[id_] = {
      file,
      state: "waiting",
      ...(!!parent && {
        parent,
      }),
    };
  }

  useUploadPopover.setState({ uploads });
};

export const setUploadState = (
  id: string,
  newState: FileUploadState,
  message: string | undefined = undefined
) => {
  useUploadPopover.setState((state) => ({
    uploads: {
      ...state.uploads,
      [id]: {
        ...state.uploads[id],
        state: newState,
        message,
      },
    },
  }));
};
