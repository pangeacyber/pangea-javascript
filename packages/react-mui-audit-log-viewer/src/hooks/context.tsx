import React, {
  createContext,
  FC,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useMemo,
} from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { Audit } from "../types";
import {
  verifyConsistencyProof,
  verifyMembershipProof,
} from "../utils/verification";
import { PublishedRoots } from "../utils/arweave";
import { constructQueryString, getTimeFilterKwargs } from "../utils/query";
import { AuditQuery, PublicAuditQuery, Sort } from "../types/query";
import { useAuditQueryState } from "./query";

export interface Pagination {
  last: string;
  history: string[];
}

const DEFAULT_LIMIT_OPTIONS = [10, 20, 30, 40, 50];
const DEFAULT_MAX_RESULT_OPTIONS = [
  100, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
];

interface AuditContextShape<Event = Audit.DefaultEvent> {
  root?: Audit.Root;
  unpublishedRoot?: Audit.Root;
  visibilityModel?: Partial<Record<keyof Event, boolean>>;
  proofs?: Record<string, boolean>;
  setProofs: Dispatch<SetStateAction<Record<string, boolean>>>;
  consistency?: Record<string, boolean>;
  setConsistency: Dispatch<SetStateAction<Record<string, boolean>>>;
  publishedRoots?: PublishedRoots;
  rowToLeafIndex?: Record<string, { leaf_index?: string }>;
  // Pagination values
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  limit: number;
  limitOptions: number[];
  setLimit: Dispatch<SetStateAction<number>>;
  maxResults: number;
  maxResultOptions: number[];
  setMaxResults: Dispatch<SetStateAction<number>>;
  resultsId: string | undefined;
  total: number;
  loading?: boolean;
  fetchResults: (body: Audit.ResultRequest) => Promise<void>;
  consistencyRef?: any;
  isVerificationCheckEnabled?: boolean;
  VerificationModalChildComp?: React.FC;
  handleVerificationCopy?: (message: string, value: string) => void;

  // Query state
  sort: Sort | undefined;
  setSort: Dispatch<SetStateAction<Sort | undefined>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  queryObj: AuditQuery | null;
  setQueryObj: Dispatch<SetStateAction<AuditQuery | null>>;

  downloadResults?: (body: Audit.DownloadResultRequest) => Promise<void>;
}

const AuditContext = createContext<AuditContextShape>({
  offset: 0,
  setOffset: () => {},
  limit: 20,
  limitOptions: DEFAULT_LIMIT_OPTIONS,
  setLimit: () => {},
  maxResults: 100,
  maxResultOptions: DEFAULT_MAX_RESULT_OPTIONS,
  setMaxResults: () => {},
  resultsId: undefined,
  total: 0,
  proofs: undefined,
  fetchResults: async () => {},
  setProofs: () => {},
  consistency: undefined,
  setConsistency: () => {},
  publishedRoots: undefined,
  isVerificationCheckEnabled: true,

  // Query state
  sort: undefined,
  setSort: () => {},
  query: "",
  setQuery: () => {},
  queryObj: null,
  setQueryObj: () => {},
});

interface AuditContextProviderProps<Event = Audit.DefaultEvent> {
  total: number;
  loading?: boolean;
  resultsId: string | undefined;

  downloadResults?: (body: Audit.DownloadResultRequest) => Promise<void>;
  fetchResults: (body: Audit.ResultRequest) => Promise<void>;

  limit?: number;
  limitOptions?: number[];
  maxResults?: number;
  maxResultOptions?: number[];
  root?: Audit.Root;
  unpublishedRoot?: Audit.Root;
  publishedRoots?: PublishedRoots;
  rowToLeafIndex?: Record<string, { leaf_index?: string }>;
  visibilityModel?: Partial<Record<keyof Event, boolean>>;
  children?: React.ReactNode;
  isVerificationCheckEnabled?: boolean;
  VerificationModalChildComp?: React.FC;
  handleVerificationCopy?: (message: string, value: string) => void;

  // Search state
  initialQuery?: string;
  filters?: PublicAuditQuery;
}

const AuditContextProvider = <Event,>({
  children,
  total,
  loading,
  resultsId,

  downloadResults,
  fetchResults,

  limit: propLimit,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  maxResults: propMaxResults,
  maxResultOptions = DEFAULT_MAX_RESULT_OPTIONS,
  root,
  unpublishedRoot,
  visibilityModel,
  publishedRoots,
  isVerificationCheckEnabled = true,
  rowToLeafIndex,
  VerificationModalChildComp,
  handleVerificationCopy,

  // Search state
  initialQuery,
  filters,
}: AuditContextProviderProps<Event>): JSX.Element => {
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(
    !!propLimit ? Number(propLimit) : 20
  );
  const [maxResults, setMaxResults] = useState<number>(
    !!propMaxResults ? Number(propMaxResults) : 100
  );
  const [proofs, setProofs] = useState<Record<string, boolean>>({});
  const [consistency, setConsistency] = useState<Record<string, boolean>>({});
  const consistencyRef = useRef({});

  // Search state
  const [sort, setSort] = useState<Sort>();
  const queryState = useAuditQueryState(initialQuery, filters);

  return (
    <AuditContext.Provider
      value={{
        visibilityModel,
        offset,
        setOffset,
        total,
        loading,
        resultsId,
        fetchResults,
        limit,
        limitOptions,
        setLimit,
        maxResults,
        maxResultOptions,
        setMaxResults,

        // Verification props. FIXME: Split into separate provider
        root,
        unpublishedRoot,
        proofs,
        setProofs,
        setConsistency,
        consistency,
        publishedRoots,
        rowToLeafIndex,
        consistencyRef,

        // Verification Controls
        isVerificationCheckEnabled,
        VerificationModalChildComp,
        handleVerificationCopy,

        downloadResults,

        sort,
        setSort,
        ...queryState,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};

export const useAuditContext = () => {
  return useContext(AuditContext);
};

export const usePagination = (): {
  hasPagination: boolean;
  page: number;
  pageSize: number;
  rowCount: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  offset: number;
  onPageSizeChange: (pageSize: number) => void;
  rowsPerPageOptions: number[];
  maxResults: number;
  onMaxResultChange?: (maxResults: number) => void;
  maxResultOptions: number[];
} => {
  const {
    offset,
    setOffset,
    total,
    limit,
    resultsId,
    fetchResults,
    setLimit,
    limitOptions,
    maxResults,
    setMaxResults,
    maxResultOptions,
  } = useAuditContext();
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const pageSize = limit;
  const rowCount = total;

  const hasNext =
    !!resultsId &&
    totalPages > 1 &&
    Math.ceil((offset + limit) / limit) < totalPages;
  const hasPrevious = !!resultsId && offset > 0;

  const setOffset_ = (newOffset: number) => {
    if (!resultsId) return;
    setOffset(newOffset);

    fetchResults({
      id: resultsId,
      offset: newOffset,
      limit,
    });
  };

  const onPageChange = (page_: number) => {
    const page = Math.floor(offset / limit) + 1;
    if (page_ === page) return;

    const offset_ = (page_ - 1) * limit;
    setOffset_(offset_);
  };

  const onPageSizeChange = (newLimit: number) => {
    setLimit(newLimit);

    if (!resultsId) return;
    fetchResults({
      id: resultsId,
      offset: 0,
      limit: newLimit,
    });
  };

  const onMaxResultChange = (newMaxResults: number) => {
    setMaxResults(newMaxResults);
  };

  useEffect(() => {
    setOffset(0);
  }, [resultsId]);

  return {
    hasPagination: !!resultsId,
    page: Math.floor(offset / limit) + 1,
    onPageChange,
    totalPages,
    hasPrevious,
    hasNext,
    rowCount,
    offset,
    pageSize,
    onPageSizeChange,
    rowsPerPageOptions: limitOptions,
    maxResults,
    maxResultOptions,
    onMaxResultChange,
  };
};

export const useConsitency = (
  record: Audit.FlattenedAuditRecord,
  idx?: number
): {
  isConsistent: boolean;
  isConsistentWithNext: boolean;
  isConsistentWithPrevious: boolean;
  transactionId?: string;
  root?: Audit.Root;
} => {
  const {
    publishedRoots,
    consistency,
    setConsistency,
    rowToLeafIndex,
    consistencyRef,
  } = useAuditContext();
  const consistencyKey = `${record?.leaf_index}`;
  const transactionId =
    (get(publishedRoots, record?.leaf_index ?? "") as Audit.Root)
      ?.transactionId ?? "";

  const isConsistent = get(consistency ?? {}, consistencyKey, false);

  const getIndex = (id: any): string =>
    get(rowToLeafIndex, id, { leaf_index: "" })?.leaf_index ?? "";

  const isConsistentWithNext =
    get(consistency ?? {}, getIndex(record.id + 1), false) && isConsistent;
  const isConsistentWithPrevious =
    get(consistency ?? {}, getIndex(record.id - 1), false) && isConsistent;

  const setLeafIsConsistent = (isValid: boolean) => {
    setConsistency((state) => ({
      ...state,
      [consistencyKey]: isValid,
    }));
  };

  useEffect(() => {
    if (
      !record ||
      !consistencyKey ||
      consistencyKey in (consistencyRef?.current ?? {}) ||
      !publishedRoots
    )
      return;

    (consistencyRef?.current ?? {})[consistencyKey] = false;
    verifyConsistencyProof({ record, publishedRoots }).then((isValid) => {
      setLeafIsConsistent(isValid);
    });
  }, [record?.leaf_index, publishedRoots]);

  return {
    isConsistent,
    isConsistentWithNext,
    isConsistentWithPrevious,
    transactionId,
  };
};

export const useVerification = (
  record: Audit.FlattenedAuditRecord,
  idx?: number
): {
  isMembershipValid: boolean;
  isPendingVerification: boolean;
  isConsistentWithPrevious: boolean;
  isConsistentWithNext: boolean;
  transactionId?: string;
  isConsistent: boolean;
  root?: Audit.Root;
  unpublishedRoot?: Audit.Root;
  VerificationModalChildComp?: React.FC;
} => {
  const {
    root,
    unpublishedRoot,
    proofs,
    setProofs,
    consistencyRef,
    VerificationModalChildComp,
  } = useAuditContext();
  const {
    isConsistent,
    transactionId,
    isConsistentWithPrevious,
    isConsistentWithNext,
  } = useConsitency(record, idx);
  const proofKey = `${record?.hash}:${record?.membership_proof}`;

  const isMembershipValid = !!get(proofs ?? {}, proofKey, false);
  const setIsMembershipValid = (isValid: boolean) => {
    setProofs((state) => ({
      ...state,
      [proofKey]: isValid,
    }));
  };

  useEffect(() => {
    const root_ = record?.published ? root : unpublishedRoot;
    if (
      !record ||
      !root_ ||
      record?.membership_proof === undefined ||
      idx === undefined ||
      proofKey in (proofs ?? {}) ||
      proofKey in (consistencyRef?.current ?? {})
    )
      return;
    // @ts-ignore
    (consistencyRef?.current ?? {})[proofKey] = false;

    verifyMembershipProof({ record, root: root_ }).then((isValid) => {
      setTimeout(() => {
        setIsMembershipValid(isValid);
      }, 10);
    });
  }, [record, root]);

  if (!root && !unpublishedRoot) {
    return {
      isMembershipValid: false,
      isPendingVerification: true,
      isConsistentWithPrevious: false,
      isConsistentWithNext: false,
      transactionId,
      isConsistent,
      root,
      unpublishedRoot,
      VerificationModalChildComp,
    };
  }

  return {
    isMembershipValid,
    isPendingVerification: get(proofs ?? {}, proofKey) === undefined,
    isConsistentWithPrevious: isConsistentWithPrevious && isMembershipValid,
    isConsistentWithNext: isConsistentWithNext && isMembershipValid,
    transactionId,
    isConsistent,
    root,
    unpublishedRoot,
    VerificationModalChildComp,
  };
};

interface UseAuditQuery {
  body: Audit.SearchRequest | null;
  bodyWithoutQuery: Audit.SearchRequest | null;
}

export const useAuditBody = (
  limit: number,
  maxResults: number
): UseAuditQuery => {
  const {
    query,
    queryObj,
    sort,

    setQuery,
  } = useAuditContext();

  const bodyWithoutQuery = useMemo<Audit.SearchRequest | null>(() => {
    if (isEmpty(queryObj)) return null;
    return {
      query: "",
      ...getTimeFilterKwargs(queryObj),
      ...(sort ?? {}),
      limit,
      max_results: maxResults,
      verbose: true,
    };
  }, [queryObj, sort, maxResults]);

  const body = useMemo<Audit.SearchRequest | null>(() => {
    return {
      ...bodyWithoutQuery,
      query: query,
    };
  }, [query, bodyWithoutQuery]);

  useEffect(() => {
    const queryString = constructQueryString(queryObj);
    if (queryString) setQuery(queryString);
  }, [queryObj]);

  return { body, bodyWithoutQuery };
};

export default AuditContextProvider;
