// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { Audit } from "../types";
import CryptoJS from "crypto-js";
import MerkleTools from "merkle-tools";
import { PublishedRoots } from "./arweave";

// @ts-ignore
const merkleTools = new MerkleTools();

const decodeHash = (value: string): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Hex.parse(value);
};

const hashPair = (
  hash1: CryptoJS.lib.WordArray,
  hash2: CryptoJS.lib.WordArray
): string => {
  var sha256 = CryptoJS.algo.SHA256.create();

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
  data.split(",").forEach((item) => {
    const parts = item.split(":");
    proof.push({
      side: parts[0] == "l" ? "left" : "right",
      nodeHash: decodeHash(parts[1]),
    });
  });
  return proof;
};

const constructProof = (data: string): (LeftProof | RightProof)[] => {
  if (!data) return [];
  // @ts-ignore
  const proofs: (LeftProof | RightProof)[] = data.split(",").map((item) => {
    const parts = item.split(":");
    const side = parts[0] == "l" ? "left" : "right";
    return {
      [side]: parts[1],
    };
  });

  return proofs;
};

interface RootProofItem {
  nodeHash: CryptoJS.lib.WordArray;
  proof: ProofItem[];
}

const decodeRootProof = (data: string[]): RootProofItem[] => {
  const rootProof: RootProofItem[] = [];
  data.forEach((item) => {
    const [nodeHash, ...proofData] = item.split(",");

    rootProof.push({
      nodeHash: decodeHash(nodeHash.split(":")[1]),
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
    const proofHash = proofs[idx].nodeHash;

    nodeHash = decodeHash(
      proofs[idx].side === "left"
        ? hashPair(proofHash, nodeHash)
        : hashPair(nodeHash, proofHash)
    );
  }

  return nodeHash.toString() === rootHash.toString();
};

export const verifyMembershipProof = async ({
  record,
  root,
}: {
  record: Audit.AuditRecord;
  root: Audit.Root;
}): Promise<boolean> => {
  if (record.membership_proof === undefined) return false;
  if (!record.hash) return false;

  const proofs = constructProof(record.membership_proof);
  return merkleTools.validateProof(
    // @ts-ignore
    proofs,
    record.hash,
    root.root_hash
  );

  // Leaving orginial proof code here
  const nodeHash = decodeHash(record.hash ?? "");
  const rootHash = decodeHash(root.root_hash);
  // @ts-ignore
  const proof = decodeProof(record.membership_proof);

  return verifyLogProof(nodeHash, rootHash, proof);
};

export const verifyConsistencyProof_ = async ({
  newRoot,
  prevRoot,
}: {
  record: Audit.AuditRecord;
  newRoot: Audit.Root;
  prevRoot: Audit.Root;
}): Promise<boolean> => {
  if (!newRoot || !prevRoot) {
    return false;
  }

  const prevRootHash = decodeHash(prevRoot.root_hash);
  const newRootHash = decodeHash(newRoot.root_hash);
  const consistencyProof = decodeRootProof(newRoot.consistency_proof);

  let rootHash = consistencyProof[0].nodeHash;
  consistencyProof.forEach((rootProof, idx) => {
    if (idx === 0) return;
    rootHash = decodeHash(hashPair(rootProof.nodeHash, rootHash));
  });

  if (rootHash.toString() !== prevRootHash.toString()) {
    return false;
  }

  for (var idx = 0; idx < consistencyProof.length; idx++) {
    const rootProof = consistencyProof[idx];
    if (!verifyLogProof(rootProof.nodeHash, newRootHash, rootProof.proof)) {
      return false;
    }
  }

  return true;
};

export const verifyConsistencyProof = async ({
  publishedRoots,
  record,
}: {
  publishedRoots: PublishedRoots;
  record: Audit.AuditRecord;
}): Promise<boolean> => {
  const leafIndex = Number(record.leaf_index);

  // We can't validate the consistency proof for messages of the beginning of the published
  //  hot trees.. but we want a line.
  if (!leafIndex) return true;

  const newRoot = publishedRoots[leafIndex + 1];
  const prevRoot = publishedRoots[leafIndex];
  if (!newRoot || !prevRoot) return false;

  return verifyConsistencyProof_({ newRoot, prevRoot, record });
};
