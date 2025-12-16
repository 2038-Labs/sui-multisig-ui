import { ForwardedRef, forwardRef, useCallback } from 'react';
import type { SuiTransactionBlockResponse } from '@mysten/sui/client';
interface Props {
  response: SuiTransactionBlockResponse;
  resetForm: VoidFunction;
}

const TxResult = forwardRef<HTMLDivElement, Props>(
  ({ response, resetForm }, ref?: ForwardedRef<HTMLDivElement>) => {
    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(
        `https://suivision.xyz/txblock/${response.digest}`
      );
      alert('Signature copied to clipboard');
    }, [response.digest]);

    return (
      <div className="mockup-code mt-4" ref={ref}>
        <pre data-prefix="$">
          <code>Status</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>{response.effects?.status.status}</code>
        </pre>
        <pre data-prefix="$">
          <code>Digest</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>{response.digest}</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>
            <button className="btn btn-sm btn-success" onClick={handleCopy}>
              Copy
            </button>
            <button className="btn btn-sm btn-gray ml-1" onClick={resetForm}>
              Reset
            </button>
          </code>
        </pre>
      </div>
    );
  }
);

// TxResult.displayName = 'TxResult';
export default TxResult;
