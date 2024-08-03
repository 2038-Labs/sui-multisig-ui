import { useState } from "react";
import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";

interface Props { }
const WalletButton = ({ }: Props) => {

    const currentAccount = useCurrentAccount();
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const { mutate: disconnect } = useDisconnectWallet();

    const handleDisconnect = () => {
        disconnect();
        setIsHovered(false);
    }

    return <div className="px-4 pt-4 w-fit ml-auto">
        {
            !currentAccount ? <ConnectModal
                trigger={<button className="btn " disabled={!!currentAccount}> {currentAccount ? "Connected" : "Connect"}</button>}
            /> :
                <button onClick={handleDisconnect} className={`btn ${isHovered ? "btn-error" : "btn-primary"}`} onMouseOver={() => setIsHovered(true)} onMouseOut={() => { setIsHovered(false) }}>
                    {
                        isHovered ?
                            <span>Disconnect</span>
                            :
                            <span>{currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}</span>
                    }
                </button>
        }
    </div>;
};

export default WalletButton;
