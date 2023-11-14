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
  PasswordPolicy,
  usePangeaListRequest,
} from "@pangeacyber/react-mui-shared";

export interface StoreFileViewerContextProps {
  apiRef: StoreProxyApiRef;
  configurations?: StoreConfigurations;

  data: ObjectStore.ListResponse;
  error: PangeaError | undefined;

  reload: () => void;
  loading: boolean;

  request: PangeaListRequestProps<ObjectStore.Filter>;

  previewId: string | undefined;
  setPreviewId: Dispatch<SetStateAction<string | undefined>>;

  parent: ObjectStore.ObjectResponse | undefined;
}

const DEFAULT_LIST_RESPONSE = {
  count: 0,
  last: "",
  objects: [],
};

const DEFAULT_LIST_REQUEST_PROPS = {
  page: 0,
  setPage: () => {},

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

  previewId: undefined,
  setPreviewId: () => {},

  parent: undefined,
});

export interface StoreFileViewerProviderProps {
  children?: React.ReactNode;

  apiRef: StoreProxyApiRef;
  configurations?: StoreConfigurations;
  defaultFilter?: ObjectStore.Filter;
  defaultSort?: "asc" | "desc";
  defaultSortBy?: keyof ObjectStore.ObjectResponse;
}

const StoreFileViewerProvider: FC<StoreFileViewerProviderProps> = ({
  children,
  apiRef,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
}) => {
  const [loading, setLoading] = useState(false);

  const defaultFilterWithFolder = useMemo(() => {
    return {
      parent_id: "",
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
    }
  );

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
        if (response.status === "Success") setData(response.result);
        else setError(response);

        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!!request.filters.parent_id && !!apiRef.get) {
      apiRef
        .get({ id: request.filters.parent_id })
        .then((response) => {
          if (response.status === "Success") setParent(response.result.object);
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
  }, [request.filters.parent_id]);

  useEffect(() => {
    search();
    return () => {
      setLoading(false);
    };
  }, [request.body]);

  return (
    <StoreFileViewerContext.Provider
      value={{
        apiRef,
        configurations,
        data,
        error,

        reload: search,
        loading: loading && !data?.objects?.length,

        request,

        previewId,
        setPreviewId,

        parent,
      }}
    >
      {children}
    </StoreFileViewerContext.Provider>
  );
};

export const useStoreFileViewerFolder = () => {
  const { request, parent } = useStoreFileViewerContext();

  const setFolder = useCallback(
    (folder: string) => {
      request.setFilters({ path: folder });
    },
    [request.setFilters]
  );

  const setParentId = useCallback(
    (parentId: string) => {
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
    folder: parent?.path ?? !!parent ? `/${parent?.name}/` : "/",
    setFolder,
    setParentId,
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
