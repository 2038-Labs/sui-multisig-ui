import { memo } from 'react';

interface Props {
  onClick: () => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}
const SendTxButton = memo<Props>(({ onClick, disabled = false, loading = false }: Props) => {
  return (
    <div className="ml-auto mt-10 w-fit">
      <button
        className="btn btn-outline btn-wide btn-md btn-info"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          'Send Tx'
        )}
      </button>
    </div>
  );
});
SendTxButton.displayName = 'SendTxButton';
export default SendTxButton;
