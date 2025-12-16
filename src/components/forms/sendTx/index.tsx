import { useCallback, useRef, useState } from 'react';
import { useSignatures } from './hooks/useSignatures';
import SignatureArray from './components/signatureArray';
import UploadFile from '../../uploadFile';
import { useSignTx } from './hooks/useSignTx';
import SendTxButton from './components/sendTxButton';
import TxResult from './components/txResult';
import PubKeysForm from './components/pubKeys';
import { PubkeyWeightPair } from './types';
import type { SuiTransactionBlockResponse } from '@mysten/sui/client';

const DEFAULT_THRESHOLD = 3 as const;
interface Props {}
const SendTxForm = ({}: Props) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [txBytes, setTxBytes] = useState<string>('');
  const [response, setResponse] = useState<
    SuiTransactionBlockResponse | undefined
  >();
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
  const [pubKeysWithWeights, setPubKeysWithWeights] = useState<
    PubkeyWeightPair[]
  >([]);
  const [loading, setLoading] = useState(false);

  const txByteFileUpload = useRef<HTMLInputElement>(null);

  const {
    signatures,
    addSignature,
    popSignature,
    updateSignature,
    resetSignatures,
  } = useSignatures(threshold);

  const { handleSignTransaction } = useSignTx();

  const handleTxBytesChange = useCallback((e: any) => {
    setTxBytes(e.target.value);
  }, []);

  const handleSendTx = useCallback(async () => {
    try {
      setLoading(true);
      const response = await handleSignTransaction(
        signatures.filter((t) => !!t),
        txBytes,
        threshold,
        pubKeysWithWeights
      );
      if (response) {
        setResponse(response);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, [
    handleSignTransaction,
    signatures,
    txBytes,
    pubKeysWithWeights,
    threshold,
  ]);

  const onload = useCallback((e: ProgressEvent<FileReader>) => {
    const result = e.target?.result as string;
    setTxBytes(result);
  }, []);

  const resetForm = useCallback(() => {
    setTxBytes('');
    setResponse(undefined);
    setThreshold(DEFAULT_THRESHOLD);
    setPubKeysWithWeights([]);
    resetSignatures(Array(DEFAULT_THRESHOLD).fill(''));
    if (txByteFileUpload.current) txByteFileUpload.current.value = '';
  }, [resetSignatures]);

  return (
    <div className="w-full pt-10">
      <label className="form-control w-full max-w-xs mx-auto">
        <div>
          <div className="label">
            <span className="label-text">Signature Threshold</span>
          </div>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            placeholder="Multi-sig threshold"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="pt-4">
          <hr />
          <div className="label">
            <span className="label-text">Signatures</span>
          </div>
          <SignatureArray
            signatures={signatures}
            threshold={threshold}
            updateSignature={updateSignature}
            addSignature={addSignature}
            popSignature={popSignature}
            resetSignatures={resetSignatures}
          />
        </div>
        <div className="pt-4">
          <hr />
          <PubKeysForm
            pubKeysWithWeights={pubKeysWithWeights}
            setPubKeysWithWeights={setPubKeysWithWeights}
          />
        </div>
        <div className="pt-4">
          <hr />
          <div className="label">
            <span className="label-text">Transaction bytes</span>
            <span className="label-text-alt">in base64 format</span>
          </div>
          <input
            type="text"
            value={txBytes}
            onChange={handleTxBytesChange}
            placeholder="Paste here"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span></span>
            <button
              className="btn btn-outline btn-sm btn-warning"
              onClick={() => {
                navigator.clipboard
                  .readText()
                  .then((value) => setTxBytes(value.trim()));
              }}
            >
              Paste from Clipboard
            </button>
          </div>
          <div className="mx-auto w-fit mt-5 mb-10">
            <span className="text-sm text-gray-400">or you can use</span>
          </div>
          <UploadFile ref={txByteFileUpload} onload={onload} />
        </div>
      </label>
      <SendTxButton onClick={handleSendTx} loading={loading} />
      {response && (
        <TxResult response={response} resetForm={resetForm} ref={resultRef} />
      )}
    </div>
  );
};

export default SendTxForm;
