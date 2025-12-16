import { PublicKey } from '@mysten/sui/cryptography';
export type PubkeyWeightPair = {
  publicKey: PublicKey;
  alias: string;
  weight: number;
};