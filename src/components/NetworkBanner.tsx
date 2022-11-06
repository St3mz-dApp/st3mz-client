import { MdErrorOutline } from "react-icons/md";
import { useNetwork } from "wagmi";
import { APP_NAME } from "../Config";
import { chain as wagmiChains } from "wagmi";

export const NetworkBanner = (): JSX.Element => {
  const { chain: activeChain } = useNetwork();

  switch (activeChain?.id) {
    case wagmiChains.foundry.id:
      return (
        <div className={"flex justify-center items-center bg-green-400 p-2"}>
          <MdErrorOutline className="h-5 w-5 mr-1" />
          <span>You are using {APP_NAME} in local network.</span>
        </div>
      );
    case wagmiChains.polygonMumbai.id:
      return (
        <div className={"flex justify-center items-center bg-primary p-2"}>
          <MdErrorOutline className="h-5 w-5 mr-1" />
          <span>You are using {APP_NAME} in Mumbai test network.</span>
        </div>
      );
    default:
      return <></>;
  }
};
