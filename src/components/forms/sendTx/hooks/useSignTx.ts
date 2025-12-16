import { MultiSigPublicKey } from '@mysten/sui/multisig';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { useCallback, useMemo } from 'react';
import { PubkeyWeightPair } from '../types';

const createMultiSigPubKey = (
  threshold: number,
  pubKeysWithWeights: PubkeyWeightPair[]
) => {
  console.log({ threshold, pubKeysWithWeights });
  return MultiSigPublicKey.fromPublicKeys({
    threshold: threshold,
    publicKeys: pubKeysWithWeights,
  });
};

export const useSignTx = () => {
  const handleSignTransaction = useCallback(
    async (
      signatures: string[],
      txBytes: string,
      threshold: number,
      pubKeysWithWeights: PubkeyWeightPair[],
      client = new SuiClient({
        url: 'https://fullnode.mainnet.sui.io:443',
      })
    ) => {
      if (signatures.length === 0) {
        alert('No signatures provided');
        return;
      }

      if (threshold === 0) {
        alert('Threshold must be greater than 0');
        return;
      }

      if (pubKeysWithWeights.length === 0) {
        alert('No public keys provided');
        return;
      }

      let txb: Transaction | null = null;
      try {
        txb = Transaction.from(txBytes);
      } catch (error) {
        alert('Invalid transaction bytes');
        return;
      }

      try {
        const combinedSignature = createMultiSigPubKey(
          threshold,
          pubKeysWithWeights
        ).combinePartialSignatures(signatures);

        // build transaction
        const bytes = await txb.build({ client });
        const resp = await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature: combinedSignature,
        });
        return resp;
      } catch (e) {
        console.error(e);
        alert(e);
      }
    },
    []
  );

  return useMemo(
    () => ({
      handleSignTransaction,
    }),
    [handleSignTransaction]
  );
};
