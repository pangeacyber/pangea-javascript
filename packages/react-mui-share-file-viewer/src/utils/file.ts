import { alertOnError } from "../components/AlertSnackbar/hooks";
import { getPasswordForDownload } from "../components/DownloadPasswordPopover/hooks";
import { ObjectStore, ShareProxyApiRef } from "../types";

export function createMultipartUploadForm(
  file: File,
  body: ObjectStore.PutRequest
): FormData {
  /**
   * when we have a content type of multipart/form-data
   * we need to use the browser's FormData interface
   * and send that instead of a string
   */
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(body)], {
      type: "application/json",
    })
  );

  if (file) {
    // Supporting file upload only ATM
    formData.append(
      "upload",
      new File([file], file.name, {
        type: "application/octet-stream",
      })
    );
  }

  return formData;
}

export const downloadFile = async (
  data: ObjectStore.ObjectResponse,
  apiRef: ShareProxyApiRef
) => {
  if (!data.id || !apiRef.get) return;
  if (data.type === "folder" && !!apiRef.getArchive) {
    return apiRef
      .getArchive({
        ids: [data.id],
        format: "zip",
        transfer_method: "dest-url",
      })
      .then((response) => {
        if (response.status === "Success" && !!response.result.dest_url) {
          const location = response.result.dest_url;
          if (location) {
            window.open(location, "_blank");
          }
        }
      })
      .catch((err) => {
        alertOnError(err);
        throw err;
      });
  }

  const handleFileDownload = async (body: Partial<ObjectStore.GetRequest>) => {
    if (!apiRef?.get) return;
    return apiRef
      .get({ id: data.id, transfer_method: "dest-url", ...body })
      .then((response) => {
        if (response.status === "Success") {
          const location = response.result.dest_url;
          if (location) {
            window.open(location, "_blank");
          }
        }
      })
      .catch((err) => {
        alertOnError(err);
        throw err;
      });
  };

  if (
    !!data?.["vault-password-algorithm"] ||
    !!data?.metadata_protected?.["vault-password-algorithm"]
  ) {
    return new Promise((resolve, reject) => {
      const handleCancel = () => {
        resolve(undefined);
      };

      getPasswordForDownload(
        data,
        (password, algo) =>
          handleFileDownload({
            password,
          })
            .then(resolve)
            .catch((err) => {
              return false;
            }),
        handleCancel
      );
    });
  }

  return handleFileDownload({});
};
