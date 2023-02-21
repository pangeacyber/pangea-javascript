import React, {
  createContext,
  FC,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";

import { Audit } from "../types";
import {
  verifyConsistencyProof,
  verifyMembershipProof,
} from "../utils/verification";
import { PublishedRoots } from "../utils/arweave";

export interface Pagination {
  last: string;
  history: string[];
}

const DefaultVisibility: Partial<Record<keyof Audit.Event, boolean>> = {
  received_at: true,
  message: true,
  actor: false,
  action: false,
  status: false,
  target: false,
  old: false,
  new: false,
  source: false,
  timestamp: false,
};

const DefaultOrder = [
  "received_at",
  "timestamp",
  "actor",
  "action",
  "status",
  "target",
  "source",
  "message",
];

interface AuditContextShape {
  root?: Audit.Root;
  unpublishedRoot?: Audit.Root;
  visibilityModel?: Partial<Record<keyof Audit.Event, boolean>>;
  visibility: Partial<Record<keyof Audit.Event, boolean>>;
  order: string[];
  setOrder: Dispatch<SetStateAction<string[]>>;
  setVisibility: (update: Partial<Record<keyof Audit.Event, boolean>>) => void;
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
  resultsId: string | undefined;
  total: number;
  fetchResults: (body: Audit.ResultRequest) => Promise<void>;
  consistencyRef?: any;
  isVerificationCheckEnabled?: boolean;
}

const AuditContext = createContext<AuditContextShape>({
  visibility: cloneDeep(DefaultVisibility),
  order: DefaultOrder,
  setOrder: () => {},
  setVisibility: () => {},
  offset: 0,
  setOffset: () => {},
  limit: 20,
  limitOptions: [10, 20, 30, 40, 50],
  setLimit: () => {},
  resultsId: undefined,
  total: 0,
  proofs: undefined,
  fetchResults: async () => {},
  setProofs: () => {},
  consistency: undefined,
  setConsistency: () => {},
  publishedRoots: undefined,
  isVerificationCheckEnabled: true,
});

const AuditContextProvider: FC<{
  total: number;
  resultsId: string | undefined;
  fetchResults: (body: Audit.ResultRequest) => Promise<void>;
  limit?: number;
  limitOptions?: number[];
  root?: Audit.Root;
  unpublishedRoot?: Audit.Root;
  publishedRoots?: PublishedRoots;
  rowToLeafIndex?: Record<string, { leaf_index?: string }>;
  visibilityModel?: Partial<Record<keyof Audit.Event, boolean>>;
  children?: React.ReactNode;
  isVerificationCheckEnabled?: boolean;
}> = ({
  children,
  total,
  resultsId,
  fetchResults,
  limit: propLimit,
  limitOptions = [10, 20, 30, 40, 50],
  root,
  unpublishedRoot,
  visibilityModel = {},
  publishedRoots,
  isVerificationCheckEnabled = true,
  rowToLeafIndex,
}) => {
  const [visibility, setVisibility_] = useState(
    cloneDeep({
      ...DefaultVisibility,
      ...visibilityModel,
    })
  );
  const [order, setOrder] = useState(DefaultOrder);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(
    !!propLimit ? Number(propLimit) : 20
  );
  const [proofs, setProofs] = useState<Record<string, boolean>>({});
  const [consistency, setConsistency] = useState<Record<string, boolean>>({});
  const consistencyRef = useRef({});

  const setVisibility = (vis: Partial<Record<keyof Audit.Event, boolean>>) => {
    setVisibility_({
      ...vis,
      ...visibilityModel,
    });
  };

  return (
    <AuditContext.Provider
      value={{
        visibilityModel,
        visibility,
        order: order.filter((fieldName) => !get(visibilityModel, fieldName)),
        setVisibility,
        setOrder,
        offset,
        setOffset,
        total,
        resultsId,
        fetchResults,
        limit,
        limitOptions,
        setLimit,

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
        isVerificationCheckEnabled,
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
    get(publishedRoots, record?.leaf_index ?? "", {}).transactionId ?? "";

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
} => {
  const { root, unpublishedRoot, proofs, setProofs, consistencyRef } =
    useAuditContext();
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
  };
};

export default AuditContextProvider;
