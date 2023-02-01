import { MdErrorOutline } from "react-icons/md";
import { useNetwork } from "wagmi";
import { fantomTestnet, foundry } from "@wagmi/core/chains";
import { APP_NAME } from "../Config";

export const NetworkBanner = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();

  switch (activeChain?.id) {
    case foundry.id:
      return (
        <div className={"flex items-center justify-center bg-green-400 p-2"}>
          <MdErrorOutline className="mr-1 h-5 w-5" />
          <span>You are using {APP_NAME} in local network.</span>
        </div>
      );
    case fantomTestnet.id:
      return (
        <div className={"flex items-center justify-center bg-primary p-2"}>
          <MdErrorOutline className="mr-1 h-5 w-5" />
          <span>You are using {APP_NAME} in test network.</span>
        </div>
      );
    default:
      return <></>;
  }
};
