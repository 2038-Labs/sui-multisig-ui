import { FC, useState } from "react";
import "./App.css";
import SignForm from "./components/forms/signForm";
import WalletButton from "./components/walletButton";

type ActionType = 'sign' | 'send' | 'none'

type MyAppProps = {};
const MyApp: FC<MyAppProps> = () => {
  const [action, setAction] = useState<ActionType>('none')

  const Form = () => {
    switch (action) {
      case 'sign':
        return <SignForm />;
      case 'send':
        return <div className="mt-5">(COMING SOON!)</div>;
      case 'none':
        return <div></div>;
    }
  }

  return (
    <div className="lg:w-1/2 mx-auto">
      <div className="">
        <WalletButton />
      </div>
      <div className="mt-4 p-4">
        <select className="select select-info max-w-xs" onChange={(e) => {
          setAction(e.currentTarget.value as ActionType)
        }} defaultValue={"none"} value={action}>
          <option disabled selected value={"none"}>Select tools</option>
          <option value={"sign"}>Sign transaction bytes</option>
          <option value={"send"}>Send transaction multisig</option>
        </select>
        <Form />
      </div>
    </div>
  );
};

export default MyApp;
