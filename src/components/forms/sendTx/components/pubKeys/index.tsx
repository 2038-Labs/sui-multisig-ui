import { Dispatch, memo, useCallback, useRef } from 'react';
import UploadFile from '../../../../uploadFile';
import { PubkeyWeightPair } from '../../types';
import DownloadTemplate from './downloadTemplate';
import PubKeyItem from './pubKeyItem';
import { publicKeyFromSuiBytes } from '@mysten/sui/verify';

type RawPubkeyWeightPair = {
  publicKey: string;
  alias: string;
  weight: number;
};

const parseUploadResult = (data: string) => {
  return (JSON.parse(data) as RawPubkeyWeightPair[]).map(
    ({ publicKey, alias, weight }) => ({
      publicKey: publicKeyFromSuiBytes(publicKey),
      alias,
      weight,
    })
  );
};

interface Props {
  pubKeysWithWeights: PubkeyWeightPair[];
  setPubKeysWithWeights: Dispatch<React.SetStateAction<PubkeyWeightPair[]>>;
}
const PubKeysForm = memo<Props>(
  ({ pubKeysWithWeights, setPubKeysWithWeights }: Props) => {
    const pubKeysFileUpload = useRef<HTMLInputElement>(null);
    const onload = useCallback((e: ProgressEvent<FileReader>) => {
      const parsed = parseUploadResult(e.target?.result as string);
      setPubKeysWithWeights(parsed);
      if (pubKeysFileUpload.current) pubKeysFileUpload.current.value = '';
    }, []);

    return (
      <>
        <div className="label">
          <span className="label-text">Public Keys with weight</span>
        </div>
        <DownloadTemplate />
        <UploadFile accept=".json" ref={pubKeysFileUpload} onload={onload} />
        {pubKeysWithWeights.length > 0 && (
          <>
            <div className="label-text mt-4 mb-2">Public Keys:</div>
            {pubKeysWithWeights.map((item) => (
              <PubKeyItem key={item.alias} {...item} />
            ))}
          </>
        )}
      </>
    );
  }
);
PubKeysForm.displayName = 'PubKeysForm';
export default PubKeysForm;
