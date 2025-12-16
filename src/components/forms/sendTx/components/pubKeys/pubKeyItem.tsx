import { PublicKey } from '@mysten/sui/cryptography';
import { memo } from 'react';

const shortenValue = (value: string, start = 8, end = 8) => {
  if (value.length <= start + end) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
};

interface ItemProps {
  label: string;
  value: string | number;
}
const Item = memo<ItemProps>(({ label, value }: ItemProps) => {
  return (
    <div className="grid grid-cols-[80px_auto]">
      <span className="label-text text-sm">{label}</span>
      <span className="text-sm">: {value}</span>
    </div>
  );
});
Item.displayName = 'Item';

interface Props {
  publicKey: PublicKey;
  alias: string;
  weight: number;
}
const PubKeyItem = memo<Props>(({ publicKey, alias, weight }: Props) => {
  return (
    <div className="border rounded-md p-2 mb-4">
      <Item label="Public Key" value={shortenValue(publicKey.toBase64())} />
      <Item label="Alias" value={alias} />
      <Item label="Weight" value={weight} />
    </div>
  );
});

PubKeyItem.displayName = 'PubKeyItem';
export default PubKeyItem;
