import { useMemo } from "react";
import { PangeaResponse, StoreProxyApiRef } from "../types";

const wrapFunctionWithBucket = <T extends { [key: string]: any }, R>(
  func: ((data: T) => Promise<PangeaResponse<R>>) | undefined,
  bucketId: string | undefined
) => {
  if (!func) return undefined;
  return (data: T): Promise<PangeaResponse<R>> => {
    const modifiedData = {
      ...data,
      ...(bucketId ? { bucket_id: bucketId } : {}),
    };
    return func(modifiedData);
  };
};

export const useBucketAwareApiRef = (
  apiRef: StoreProxyApiRef,
  bucketId: string | undefined
): StoreProxyApiRef => {
  const apiRefWithBucket = useMemo(
    () => ({
      list: wrapFunctionWithBucket(apiRef.list, bucketId),
      get: wrapFunctionWithBucket(apiRef.get, bucketId),
      buckets: apiRef.buckets,
      getArchive: wrapFunctionWithBucket(apiRef.getArchive, bucketId),
      share: apiRef.share
        ? {
            list: wrapFunctionWithBucket(apiRef.share.list, bucketId),
            get: wrapFunctionWithBucket(apiRef.share.get, bucketId),
            delete: wrapFunctionWithBucket(apiRef.share?.delete, bucketId),
            create: wrapFunctionWithBucket(apiRef.share.create, bucketId),
            send: wrapFunctionWithBucket(apiRef.share.send, bucketId),
          }
        : undefined,
      delete: wrapFunctionWithBucket(apiRef.delete, bucketId),
      update: wrapFunctionWithBucket(apiRef.update, bucketId),
      upload: apiRef.upload,
      folderCreate: wrapFunctionWithBucket(apiRef.folderCreate, bucketId),
    }),
    [apiRef, bucketId]
  );

  return apiRefWithBucket;
};
