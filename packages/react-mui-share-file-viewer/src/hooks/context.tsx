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
  FileViewerProviderProps,
  ObjectStore,
  PangeaError,
  ShareConfigurations,
  ShareProxyApiRef,
} from "../types";
import {
  PangeaListRequestProps,
  usePangeaListRequest,
} from "@pangeacyber/react-mui-shared";
import AlertsSnackbar from "../components/AlertSnackbar";
import { alertOnError } from "../components/AlertSnackbar/hooks";
import { useBucketAwareApiRef } from "./utils";

export interface FileViewerContextProps {
  apiRef: ShareProxyApiRef;
  configurations?: ShareConfigurations;

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

const FileViewerContext = createContext<FileViewerContextProps>({
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

const FileViewerProvider: FC<FileViewerProviderProps> = ({
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
    <FileViewerContext.Provider
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
    </FileViewerContext.Provider>
  );
};

export const useFileViewerFolder = () => {
  const { request, parent } = useFileViewerContext();

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
      (parent?.path ?? !!parent)
        ? `${parent?.folder}/${parent?.name}/`.replace("//", "/")
        : "/",
    setFolder,
    setParentId,
  };
};

export const useFileViewerBuckets = () => {
  const { apiRef, bucketId, setBucketId, request } = useFileViewerContext();

  const setBucketId_ = useCallback(
    (updates: any) => {
      request.setFilters({
        folder: "/",
      });
      return setBucketId(updates);
    },
    [setBucketId]
  );

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
    setBucketId: setBucketId_,

    buckets,
  };
};

export interface ShareCreateContextProps {
  contentType: string;
  shareType: string;
  loading: boolean;
  sent: boolean;
  errors: { [key: string]: string } | undefined;
  password: string;
  shareLink: ObjectStore.ShareObjectResponse | undefined;
  setLoading: (value: boolean) => void;
  setSent: (value: boolean) => void;
  setErrors: (errors: { [key: string]: string }) => void;
  setPassword: (value: string) => void;
  setShareLink: (link: ObjectStore.ShareObjectResponse | undefined) => void;
  resetContext: () => void;
}

const CreateShareContext = createContext<ShareCreateContextProps>({
  contentType: "",
  shareType: "",
  loading: false,
  errors: undefined,
  password: "",
  sent: false,
  shareLink: undefined,
  setLoading: () => {},
  setSent: () => {},
  setErrors: () => {},
  setPassword: () => {},
  setShareLink: () => {},
  resetContext: () => {},
});

export interface ShareCreateProviderProps {
  contentType: string;
  shareType: string;
  children?: React.ReactNode;
}

export const ShareCreateProvider: FC<ShareCreateProviderProps> = ({
  contentType,
  shareType,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [shareLink, setShareLink] = useState<
    ObjectStore.ShareObjectResponse | undefined
  >(undefined);

  const resetContext = () => {
    setLoading(false);
    setSent(false);
    setErrors({});
    setPassword("");
    setShareLink(undefined);
  };

  return (
    <CreateShareContext.Provider
      value={{
        contentType,
        shareType,
        loading,
        sent,
        errors,
        password,
        shareLink,

        setLoading,
        setSent,
        setErrors,
        setPassword,
        setShareLink,
        resetContext,
      }}
    >
      {children}
    </CreateShareContext.Provider>
  );
};

export const useFileViewerPreview = () => {
  const { previewId, setPreviewId } = useFileViewerContext();
  return [previewId, setPreviewId];
};

export const useFileViewerContext = () => {
  return useContext(FileViewerContext);
};

export const useCreateShareContext = () => {
  return useContext(CreateShareContext);
};

export default FileViewerProvider;
