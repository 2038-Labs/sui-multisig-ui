import { FC } from "react";
import "./App.css";
import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";

type MyAppProps = {};
const MyApp: FC<MyAppProps> = () => {
  const currentAccount = useCurrentAccount();

  return (
    <div className="home-page">
      <ConnectModal
        trigger={<button disabled={!!currentAccount}> {currentAccount ? "Connected" : "Connect"}</button>}
      />
    </div>
  );
};

export default MyApp;
