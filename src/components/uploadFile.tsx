import { forwardRef, useCallback } from 'react';

const formatAcceptedFileExtensions = (accept: string) => {
  return accept
    .split(',')
    .map((ext) => ext.trim().replace('.', ''))
    .join(', ');
};

interface Props {
  onload?: ((ev: ProgressEvent<FileReader>) => any) | null;
  onloadend?: ((ev: ProgressEvent<FileReader>) => any) | null;
  onloadstart?: ((ev: ProgressEvent<FileReader>) => any) | null;
  onprogress?: ((ev: ProgressEvent<FileReader>) => any) | null;
  accept?: string;
  key?: string;
}
const UploadFile = forwardRef<HTMLInputElement, Props>(
  (
    {
      accept = '.txt',
      key = '',
      onload = null,
      onloadend = null,
      onloadstart = null,
      onprogress = null,
    }: Props,
    ref
  ) => {
    const handleUploadedFile = useCallback(
      (e: any) => {
        if (e.target.files.length === 0) return;
        const reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = onload;
        reader.onloadend = onloadend;
        reader.onloadstart = onloadstart;
        reader.onprogress = onprogress;
      },
      [onload, onloadend, onloadstart, onprogress]
    );

    return (
      <div className="mx-auto w-fit mt-4">
        <input
          key={key}
          type="file"
          ref={ref}
          onChange={handleUploadedFile}
          accept={accept}
          className="file-input file-input-bordered file-input-primary file-input-xs"
        />
        <div>
          <span className="label-text">Supported file type: </span>
          <span className="text-sm">
            {formatAcceptedFileExtensions(accept)}
          </span>
        </div>
      </div>
    );
  }
);

export default UploadFile;
