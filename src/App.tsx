import { FC, lazy, Suspense, useState } from 'react';
import WalletButton from './components/walletButton';
import './App.css';

const SignForm = lazy(() => import('./components/forms/signForm'));
const SendTxForm = lazy(() => import('./components/forms/sendTx'));

type ActionType = 'sign' | 'send';
const DEFAULT_ACTION: ActionType = 'sign';

type MyAppProps = {};
const MyApp: FC<MyAppProps> = () => {
  const [action, setAction] = useState<ActionType>(DEFAULT_ACTION);

  const Form = () => {
    switch (action) {
      case 'sign':
        return <SignForm />;
      case 'send':
        return <SendTxForm />;
    }
  };

  return (
    <div className="lg:w-1/2 mx-auto">
      <div className="">
        <WalletButton />
      </div>
      <div className="mt-4 p-4">
        <select
          className="select select-info max-w-xs"
          onChange={(e) => {
            setAction(e.currentTarget.value as ActionType);
          }}
          value={action}
        >
          <option disabled value="none">
            Select tools
          </option>
          <option value="sign">Sign transaction bytes</option>
          <option value="send">Send transaction multisig</option>
        </select>
        <Suspense fallback={<div>Loading...</div>}>
          <Form />
        </Suspense>
      </div>
    </div>
  );
};

export default MyApp;
