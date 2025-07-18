// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import CryptoJS from "crypto-js";
import MerkleTools from "merkle-tools";

import { Audit } from "@src/types.js";
import { PublishedRoots } from "./arweave.js";
import { Verifier } from "./signer.js";
import { canonicalizeEvent, canonicalizeEnvelope } from "./utils.js";

// @ts-expect-error
const merkleTools = new MerkleTools();

export function verifyLogHash(
  envelope: Audit.EventEnvelope,
  hash: string
): boolean {
  const sha256 = CryptoJS.algo.SHA256.create();
  sha256.update(canonicalizeEnvelope(envelope));
  const calcHash = sha256.finalize().toString();
  return calcHash === hash;
}

const decodeHash = (value: string): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Hex.parse(value);
};

const hashPair = (
  hash1: CryptoJS.lib.WordArray | string,
  hash2: CryptoJS.lib.WordArray | string
): string => {
  const sha256 = CryptoJS.algo.SHA256.create();

  sha256.update(hash1);
  sha256.update(hash2);

  return sha256.finalize().toString();
};

interface ProofItem {
  side: string;
  nodeHash: CryptoJS.lib.WordArray;
}

interface RightProof {
  right: string;
}

interface LeftProof {
  left: string;
}

const decodeProof = (data: string): ProofItem[] => {
  const proof: ProofItem[] = [];
  // biome-ignore lint/complexity/noForEach: TODO
  data.split(",").forEach((item) => {
    const parts = item.split(":");
    proof.push({
      side: parts[0] === "l" ? "left" : "right",
      nodeHash: decodeHash(parts[1] || ""),
    });
  });
  return proof;
};

const constructProof = (data: string): (LeftProof | RightProof)[] => {
  if (data === "") {
    return [];
  }

  // @ts-expect-error
  // biome-ignore lint/nursery/useIterableCallbackReturn: TODO
  const proofs: (LeftProof | RightProof)[] = data.split(",").map((item) => {
    const parts = item.split(":");
    if (parts.length >= 2) {
      const side = parts[0] === "l" ? "left" : "right";
      return {
        [side]: parts[1],
      };
    }
  });

  return proofs;
};

interface RootProofItem {
  nodeHash: CryptoJS.lib.WordArray;
  proof: ProofItem[];
}

const decodeRootProof = (data: string[]): RootProofItem[] => {
  const rootProof: RootProofItem[] = [];
  // biome-ignore lint/complexity/noForEach: TODO
  data.forEach((item) => {
    const [nodeHash, ...proofData] = item.split(",");

    rootProof.push({
      nodeHash: decodeHash(nodeHash?.split(":")[1] || ""),
      proof: decodeProof(proofData.join(",")),
    });
  });
  return rootProof;
};

const verifyLogProof = (
  initialNodeHash: CryptoJS.lib.WordArray,
  rootHash: CryptoJS.lib.WordArray,
  proofs: ProofItem[]
): boolean => {
  let nodeHash = initialNodeHash;
  for (let idx = 0; idx < proofs.length; idx++) {
    const proofHash = proofs[idx]?.nodeHash || "";

    nodeHash = decodeHash(
      proofs[idx]?.side === "left"
        ? hashPair(proofHash, nodeHash)
        : hashPair(nodeHash, proofHash)
    );
  }

  return nodeHash.toString() === rootHash.toString();
};

export const verifyLogMembershipProof = ({
  log,
  newUnpublishedRootHash,
}: {
  log: Audit.LogResponse;
  newUnpublishedRootHash: string | undefined;
}): string => {
  if (
    !log.hash ||
    log.membership_proof === undefined ||
    newUnpublishedRootHash === undefined
  ) {
    return "none";
  }

  const proofs = constructProof(log.membership_proof);
  return merkleTools.validateProof(
    // @ts-expect-error
    proofs,
    log.hash,
    newUnpublishedRootHash
  )
    ? "pass"
    : "fail";
};

export const verifyRecordMembershipProof = ({
  record,
  root,
}: {
  record: Audit.AuditRecord;
  root: Audit.Root | undefined;
}): string => {
  if (
    !record.hash ||
    record.membership_proof === undefined ||
    root === undefined
  ) {
    return "none";
  }

  const proofs = constructProof(record.membership_proof);
  return merkleTools.validateProof(
    // @ts-expect-error
    proofs,
    record.hash,
    root.root_hash
  )
    ? "pass"
    : "fail";
};

export const verifyLogConsistencyProof = ({
  log,
  newUnpublishedRoot,
  prevUnpublishedRoot,
}: {
  log: Audit.LogResponse;
  newUnpublishedRoot: string | undefined;
  prevUnpublishedRoot: string | undefined;
}): string => {
  if (
    log.consistency_proof !== undefined &&
    newUnpublishedRoot !== undefined &&
    prevUnpublishedRoot !== undefined
  ) {
    return verifyConsistencyProof({
      newRootEncHash: newUnpublishedRoot,
      prevRootEncHash: prevUnpublishedRoot,
      consistencyProof: log.consistency_proof,
    })
      ? "pass"
      : "fail";
  }

  return "none";
};

const verifyConsistencyProof = ({
  newRootEncHash,
  prevRootEncHash,
  consistencyProof,
}: {
  newRootEncHash: string;
  prevRootEncHash: string;
  consistencyProof: string[];
}): boolean => {
  if (!newRootEncHash || !prevRootEncHash || !consistencyProof) {
    return false;
  }

  const prevRootHash = decodeHash(prevRootEncHash);
  const newRootHash = decodeHash(newRootEncHash);
  const proofs = decodeRootProof(consistencyProof);

  let rootHash = proofs[0]?.nodeHash || "";
  proofs.forEach((rootProof, idx) => {
    if (idx === 0) {
      return;
    }
    rootHash = decodeHash(hashPair(rootProof.nodeHash, rootHash));
  });

  if (rootHash.toString() !== prevRootHash.toString()) {
    return false;
  }

  for (let idx = 0; idx < proofs.length; idx++) {
    const rootProof = proofs[idx];

    if (
      !rootProof ||
      !verifyLogProof(rootProof.nodeHash, newRootHash, rootProof.proof)
    ) {
      return false;
    }
  }

  return true;
};

export const verifyRecordConsistencyProof = ({
  publishedRoots,
  record,
}: {
  publishedRoots: PublishedRoots;
  record: Audit.AuditRecord;
}): string => {
  // If not published should not verify consistency.
  if (!record.published) {
    return "none";
  }

  const leafIndex = Number(record.leaf_index);
  const newRoot = publishedRoots[leafIndex + 1];
  const prevRoot = publishedRoots[leafIndex];

  if (leafIndex === 0) {
    return "pass";
  }

  if (!newRoot || !prevRoot) {
    return "none";
  }

  return verifyConsistencyProof({
    newRootEncHash: newRoot.root_hash,
    prevRootEncHash: prevRoot.root_hash,
    consistencyProof: newRoot.consistency_proof,
  })
    ? "pass"
    : "fail";
};

export const verifySignature = (
  envelope: Audit.EventEnvelope | undefined
): string => {
  // both undefined so "none" verification
  if (envelope?.signature === undefined && envelope?.public_key === undefined) {
    return "none";
  }

  // Just one undefined it's an error, so "fail"
  if (envelope?.signature === undefined || envelope?.public_key === undefined) {
    return "fail";
  }

  let pubKey = envelope.public_key;
  try {
    // Try to parse json for new public_key struct
    const obj = JSON.parse(pubKey);
    pubKey = obj.key;
    if (pubKey === undefined) {
      return "fail";
    }
  } catch (_) {
    // If fails to parse, it's old format (just public key as string)
    pubKey = envelope.public_key;
  }

  const v = new Verifier();
  const data = canonicalizeEvent(envelope.event);
  return v.verify(data, envelope.signature, pubKey) ? "pass" : "fail";
};
