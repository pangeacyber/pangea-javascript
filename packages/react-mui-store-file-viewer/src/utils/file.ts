import { ObjectStore } from "../types";

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
