import { useSignTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useCallback, useRef, useState } from 'react';
import UploadFile from '../uploadFile';

interface Props {}
const SignForm = ({}: Props) => {
  const [txBytes, setTxBytes] = useState<string>('');
  const [signatureResult, setSignatureResult] = useState<string>('');
  const { mutateAsync: signTransaction } = useSignTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTxBytesChange = useCallback((e: any) => {
    setTxBytes(e.target.value);
  }, []);

  const handleSignTransaction = async () => {
    let txb: Transaction | null = null;
    try {
      txb = Transaction.from(txBytes);
    } catch (error) {
      alert('Invalid transaction bytes');
      return;
    }

    try {
      const resp = await signTransaction({
        transaction: txb,
      });
      setSignatureResult(resp.signature);
    } catch (e) {
      if (e !== 'User rejected the request') return;
      alert(e);
    }
  };

  const onload = useCallback((e: ProgressEvent<FileReader>) => {
    const result = e.target?.result as string;
    setTxBytes(result);
  }, []);

  const resetForm = useCallback(() => {
    setTxBytes('');
    setSignatureResult('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <div className="w-full pt-10">
      <label className="form-control w-full max-w-xs mx-auto">
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
      </label>
      <div className="mx-auto w-fit mt-5 mb-10">
        <span className="text-sm text-gray-400">or you can use</span>
      </div>
      <UploadFile ref={fileInputRef} onload={onload} />
      <div className="ml-auto mt-10 w-fit">
        <button
          className="btn btn-outline btn-wide btn-md btn-info"
          onClick={handleSignTransaction}
        >
          Sign
        </button>
      </div>
      <div className="p-4">
        {signatureResult && (
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>Your signature..</code>
            </pre>
            <pre data-prefix=">" className="text-success">
              <code>{signatureResult}</code>
            </pre>
            <pre data-prefix=">" className="text-success">
              <code>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => {
                    navigator.clipboard.writeText(signatureResult);
                    alert('Signature copied to clipboard');
                  }}
                >
                  Copy
                </button>
                <button
                  className="btn btn-sm btn-gray ml-1"
                  onClick={() => resetForm()}
                >
                  Reset
                </button>
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignForm;
