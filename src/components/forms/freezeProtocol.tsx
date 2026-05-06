import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useCallback, useRef, useState } from 'react';
import type { SuiTransactionBlockResponse } from '@mysten/sui/client';
import { useScallopProtocolPkgId } from '../../hooks/useScallop';

// these two objects ID will never change! so it's safe to set it as constant
const MARKET_OBJECT = '0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9';
const VERSION_OBJECT_ID = '0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7';

interface Props {}
const FreezeProtocolForm = ({}: Props) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<
    SuiTransactionBlockResponse | undefined
  >();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const {
    data: protocolPkgId,
    isLoading: pkgLoading,
    error: pkgError,
  } = useScallopProtocolPkgId();

  const buildTransaction = useCallback(
    (pkgId: string): Transaction => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkgId}::app::freeze_protocol`,
        arguments: [tx.object(VERSION_OBJECT_ID), tx.object(MARKET_OBJECT)],
        typeArguments: [],
      });
      return tx;
    },
    []
  );

  const openConfirm = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeConfirm = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleExecute = useCallback(async () => {
    closeConfirm();
    if (!protocolPkgId) {
      alert('Protocol package id not loaded yet');
      return;
    }
    try {
      setLoading(true);
      const tx = buildTransaction(protocolPkgId);
      const resp = await signAndExecute({ transaction: tx });
      setResponse(resp);
    } catch (e) {
      console.error(e);
      alert(e);
    } finally {
      setLoading(false);
    }
  }, [buildTransaction, signAndExecute, closeConfirm, protocolPkgId]);

  return (
    <div className="w-full pt-10">
      <div className="max-w-xs mx-auto">
        <div className="alert alert-warning">
          <span>
            This will execute the freeze protocol transaction. Make sure you
            understand the impact before continuing.
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          {pkgError ? (
            <span className="text-error">{String(pkgError)}</span>
          ) : pkgLoading ? (
            <span>Loading protocol package id from Scallop SDK...</span>
          ) : protocolPkgId ? (
            <span>
              Protocol package: <code className="break-all">{protocolPkgId}</code>
            </span>
          ) : null}
        </div>
        <button
          className="btn btn-outline btn-wide btn-md btn-error mt-6 w-full"
          onClick={openConfirm}
          disabled={loading || !protocolPkgId}
        >
          {loading ? (
            <span className="loading loading-spinner" />
          ) : (
            'Freeze Protocol'
          )}
        </button>
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Freeze Protocol</h3>
          <p className="py-4">
            Are you sure you want to freeze the protocol? This action will
            submit a transaction on-chain.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={closeConfirm}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleExecute}>
              Confirm Freeze
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {response && (
        <div className="p-4 mt-6">
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>Transaction digest..</code>
            </pre>
            <pre data-prefix=">" className="text-success">
              <code>{response.digest}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreezeProtocolForm;
