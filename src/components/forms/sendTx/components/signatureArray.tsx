import { ChangeEvent, memo, useCallback, useRef } from 'react';
import UploadFile from '../../../uploadFile';

interface SignatureItemProps {
  index: number;
  signature: string;
  placeholder: string;
  updateSignature: (index: number, value: string) => void;
}
const SignatureItem = memo<SignatureItemProps>(
  ({ index, signature, updateSignature, placeholder }: SignatureItemProps) => {
    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        updateSignature(index, e.target.value);
      },
      [updateSignature, index]
    );

    return (
      <div className="mb-4">
        <input
          type="text"
          value={signature}
          onChange={onChange}
          placeholder={placeholder}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    );
  }
);
SignatureItem.displayName = 'SignatureItem';

const parseUploadResult = (data: string) => {
  return data.split(',');
};

interface SignatureArrayProps {
  signatures: string[];
  threshold: number;
  updateSignature: (index: number, value: string) => void;
  addSignature: VoidFunction;
  popSignature: VoidFunction;
  resetSignatures: (newSignatures: string[]) => void;
}
const SignatureArray = ({
  signatures,
  threshold,
  updateSignature,
  addSignature,
  popSignature,
  resetSignatures,
}: SignatureArrayProps) => {
  const signatureFileInputRef = useRef<HTMLInputElement>(null);
  const onload = useCallback((e: ProgressEvent<FileReader>) => {
    const parsed = parseUploadResult(e.target?.result as string);
    resetSignatures(parsed);
    if (signatureFileInputRef.current) signatureFileInputRef.current.value = '';
  }, []);

  return (
    <div className="mb-4">
      <div className="pb-0 p-4 mb-4 border border-white/50 rounded-md">
        {signatures.map((sig, index) => (
          <SignatureItem
            key={index}
            index={index}
            signature={sig}
            placeholder={`Signature ${index + 1}`}
            updateSignature={updateSignature}
          />
        ))}
      </div>
      <UploadFile
        accept=".txt,.csv"
        onload={onload}
        ref={signatureFileInputRef}
      />
      <div className="flex space-x-2 mt-4">
        <button className="btn btn-primary btn-sm" onClick={addSignature}>
          Add
        </button>
        <button
          className="btn btn-warning btn-sm"
          onClick={popSignature}
          disabled={signatures.length === threshold}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SignatureArray;
