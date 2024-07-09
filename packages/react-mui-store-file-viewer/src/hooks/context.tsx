import React, {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  ObjectStore,
  PangeaError,
  StoreConfigurations,
  StoreProxyApiRef,
} from "../types";
import {
  PangeaListRequestProps,
  usePangeaListRequest,
} from "@pangeacyber/react-mui-shared";
import AlertsSnackbar from "../components/AlertSnackbar";
import { alertOnError } from "../components/AlertSnackbar/hooks";
import { useBucketAwareApiRef } from "./utils";

export interface StoreFileViewerContextProps {
  apiRef: StoreProxyApiRef;
  configurations?: StoreConfigurations;

  data: ObjectStore.ListResponse;
  error: PangeaError | undefined;

  bucketId: string | undefined;
  setBucketId: Dispatch<SetStateAction<string | undefined>>;

  reload: () => void;
  loading: boolean;

  request: PangeaListRequestProps<ObjectStore.Filter>;

  previewId: string | undefined;
  setPreviewId: Dispatch<SetStateAction<string | undefined>>;

  parent: ObjectStore.ObjectResponse | undefined;

  updated: number | undefined;
  triggerUpdate: () => void;

  defaultShareLinkTitle?: string;
}

const DEFAULT_LIST_RESPONSE = {
  count: 0,
  last: "",
  objects: [],
};

const DEFAULT_LIST_REQUEST_PROPS = {
  page: 0,
  setPage: () => {},

  bucketId: "",
  setBucketId: () => {},

  pageSize: 0,
  setPageSize: () => {},

  last: undefined,
  setCurrentLast: () => {},
  lastKnownPage: 0,

  sorting: {},
  setSorting: () => {},

  filters: {},
  setFilters: () => {},

  body: {},
};

const StoreFileViewerContext = createContext<StoreFileViewerContextProps>({
  apiRef: {
    list: undefined,
    get: undefined,
  },
  data: DEFAULT_LIST_RESPONSE,
  error: undefined,

  reload: () => {},
  loading: false,

  request: DEFAULT_LIST_REQUEST_PROPS,

  bucketId: undefined,
  setBucketId: () => {},

  previewId: undefined,
  setPreviewId: () => {},

  parent: undefined,

  updated: 0,
  triggerUpdate: () => {},
});

export interface StoreFileViewerProviderProps {
  children?: React.ReactNode;

  apiRef: StoreProxyApiRef;
  configurations?: StoreConfigurations;

  defaultFilter?: ObjectStore.Filter;
  defaultSort?: "asc" | "desc";
  defaultSortBy?: keyof ObjectStore.ObjectResponse;

  defaultShareLinkTitle?: string;
}

const StoreFileViewerProvider: FC<StoreFileViewerProviderProps> = ({
  children,
  apiRef: apiRefProp,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  defaultShareLinkTitle,
}) => {
  const [bucketId, setBucketId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const apiRef = useBucketAwareApiRef(apiRefProp, bucketId);

  const defaultFilterWithFolder = useMemo(() => {
    return {
      folder: "/",
      ...defaultFilter,
    };
  }, [defaultFilter]);

  const request = usePangeaListRequest<ObjectStore.Filter>(
    {
      defaultFilter: defaultFilterWithFolder,
      defaultSort,
      defaultSortBy,
    },
    {
      parent_id: {
        key: "parent_id",
        ignoreFalsy: true,
      },
      folder: {
        key: "folder",
      },
    }
  );

  const [updated, setUpdated] = useState(0);
  const triggerUpdate = useCallback(() => {
    setUpdated((state) => state + 1);
  }, [setUpdated]);

  const [error, setError] = useState<PangeaError>();
  const [data, setData] = useState<ObjectStore.ListResponse>(
    DEFAULT_LIST_RESPONSE
  );

  const [previewId, setPreviewId] = useState<string>();
  const [parent, setParent] = useState<ObjectStore.ObjectResponse>();

  const search = () => {
    if (!apiRef?.list) return;

    setLoading(true);
    apiRef
      .list(request.body)
      .then((response) => {
        if (response.status === "Success") {
          setData(response.result);
          request.setCurrentLast(response.result.last);
        } else setError(response);

        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!!request.filters.parent_id && !!apiRef.list) {
      setLoading(true);
      apiRef
        .list({ filter: { id: request.filters.parent_id } })
        .then((response) => {
          if (
            response.status === "Success" &&
            response?.result?.objects?.length
          )
            setParent(response.result?.objects[0]);
          else {
            setError(response);
            setParent(undefined);
          }

          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setParent(undefined);
          setLoading(false);
        });
    } else if (!!request.filters.folder && !!apiRef.list) {
      const folder: string = request.filters.folder;
      const parts = folder.split("/").filter((p) => !!p);
      if (parts.length >= 1) {
        let name = parts.pop();

        setLoading(true);
        apiRef
          .list({
            filter: { folder: `/${parts.join("/")}`, name, type: "folder" },
          })
          .then((response) => {
            if (
              response.status === "Success" &&
              response?.result?.objects?.length
            )
              setParent(response.result?.objects[0]);
            else {
              setError(response);
              setParent(undefined);
            }

            setLoading(false);
          })
          .catch((error) => {
            setError(error);
            setParent(undefined);
            setLoading(false);
          });
      } else {
        setParent(undefined);
      }
    } else {
      setParent(undefined);
    }
  }, [apiRef.list, request.filters.parent_id, request.filters.folder]);

  useEffect(() => {
    search();
    return () => {
      setLoading(false);
    };
  }, [apiRef.list, request.body]);

  return (
    <StoreFileViewerContext.Provider
      value={{
        apiRef,
        configurations,
        data,
        error,

        bucketId,
        setBucketId,

        reload: search,
        loading: loading && !data?.objects?.length,

        request,

        previewId,
        setPreviewId,

        parent,

        updated,
        triggerUpdate,

        defaultShareLinkTitle,
      }}
    >
      {children}
      {!!configurations?.alerts?.displayAlertOnError && (
        <AlertsSnackbar {...configurations?.alerts?.AlertSnackbarProps} />
      )}
    </StoreFileViewerContext.Provider>
  );
};

export const useStoreFileViewerFolder = () => {
  const { request, parent } = useStoreFileViewerContext();

  const setFolder = useCallback(
    (folder: string) => {
      request.setPage(1);
      request.setFilters({ folder });
    },
    [request.setFilters]
  );

  const setParentId = useCallback(
    (parentId: string) => {
      request.setPage(1);
      if (!parentId)
        return request.setFilters({
          parent_id: "",
        });

      request.setFilters({ parent_id: parentId });
    },
    [request.setFilters, parent?.id]
  );

  return {
    parent,
    folder:
      parent?.path ?? !!parent
        ? `${parent?.folder}/${parent?.name}/`.replace("//", "/")
        : "/",
    setFolder,
    setParentId,
  };
};

export const useStoreFileViewerBuckets = () => {
  const { apiRef, bucketId, setBucketId } = useStoreFileViewerContext();

  const [buckets, setBuckets] = useState<ObjectStore.BucketInfo[]>([]);

  const handleFetchBuckets = async () => {
    if (!apiRef.buckets) {
      setBuckets([]);
      return;
    }

    return apiRef
      .buckets({})
      .then((response) => {
        // Instead we need to prompt open the modal
        const buckets = response?.result?.buckets ?? [];
        if (buckets.length) {
          setBuckets(buckets);
        }
      })
      .catch((err) => {
        alertOnError(err);

        return false;
      });
  };

  useEffect(() => {
    handleFetchBuckets();
  }, [apiRef?.buckets]);

  return {
    bucketId,
    setBucketId,

    buckets,
  };
};

export const useStoreFileViewerPreview = () => {
  const { previewId, setPreviewId } = useStoreFileViewerContext();
  return [previewId, setPreviewId];
};

export const useStoreFileViewerContext = () => {
  return useContext(StoreFileViewerContext);
};

export const useStoreViewerData = () => {
  const { apiRef } = useStoreFileViewerContext();
};

export default StoreFileViewerProvider;
