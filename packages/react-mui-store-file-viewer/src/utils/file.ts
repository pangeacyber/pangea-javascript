import { ObjectStore } from "../types";

export function createMultipartUploadForm(
  files: FileList,
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

  if (files.length) {
    // Supporting file upload only ATM
    formData.append(
      "upload",
      new File([files[0]], files[0].name, {
        type: "application/octet-stream",
      })
    );
  }

  return formData;
}
