import { useParams } from "react-router-dom";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider } from "wagmi";
import { getNetwork } from "../Config";
import { Token } from "../models/Token";
import utilContractData from "../contracts/St3mzUtil.json";
import {
  getIpfsUri,
  launchToast,
  respToToken,
  ToastType,
  trim,
} from "../utils/util";
import { TokenCard } from "../components/TokenCard";
import axios from "axios";

export const AccountPage = (): JSX.Element => {
  const { address } = useParams<{ address: string }>();
  const provider = useProvider();
  const [tokensCreated, setTokensCreated] = useState<Token[]>([]);
  const [tokensOwned, setTokensOwned] = useState<Token[]>([]);
  const { chain: activeChain } = useNetwork();

  useEffect(() => {
    if (address) {
      getTokensCreated();
      getTokensOwned();
    }
  }, [address]);

  // Get list of tokens created by the account
  const getTokensCreated = async () => {
    if (!provider) {
      return;
    }

    // Instantiate Util contract
    const utilContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).utilAddress,
      utilContractData.abi,
      provider
    );

    // Get tokens from contract
    try {
      const resp = await utilContract.getTokens(12, 1, true);

      const _tokens = await Promise.all(
        resp.map(async (item: any) => {
          const _token = respToToken(item);
          let meta;
          try {
            meta = (await axios.get(getIpfsUri(_token.uri))).data;
          } catch (e) {
            console.log(e);
          }
          return { ..._token, metadata: meta };
        })
      );

      setTokensCreated(_tokens);
    } catch (e) {
      console.log(e);
      launchToast(
        "An error occurred fetching list of available items.",
        ToastType.Error
      );
    }
  };

  // Get list of tokens owned by the account
  const getTokensOwned = async () => {
    if (!provider) {
      return;
    }

    // Instantiate Util contract
    const utilContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).utilAddress,
      utilContractData.abi,
      provider
    );

    // Get tokens from contract
    try {
      const resp = await utilContract.getTokens(12, 1, true);

      const _tokens = await Promise.all(
        resp.map(async (item: any) => {
          const _token = respToToken(item);
          let meta;
          try {
            meta = (await axios.get(getIpfsUri(_token.uri))).data;
          } catch (e) {
            console.log(e);
          }
          return { ..._token, metadata: meta };
        })
      );

      setTokensOwned(_tokens);
    } catch (e) {
      console.log(e);
      launchToast(
        "An error occurred fetching list of available items.",
        ToastType.Error
      );
    }
  };

  return (
    <div>
      <h1 className="text-center text-6xl font-bold">
        Account {address ? trim(address) : ""}
      </h1>
      <div className="container mx-auto my-4 lg:my-12 xl:px-12">
        <h2 className="border-b-2 border-secondary text-3xl font-bold">
          Owned
        </h2>
        {tokensOwned?.length ? (
          <div className="-mx-1 flex flex-wrap lg:-mx-4">
            {tokensOwned.map((token) => (
              <TokenCard key={token.id} token={token}></TokenCard>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center text-2xl font-bold">
            No tokens owned
          </div>
        )}
      </div>
      <div className="container mx-auto my-4 lg:my-12 xl:px-12">
        <h2 className="border-b-2 border-secondary text-3xl font-bold">
          Created
        </h2>
        {tokensCreated?.length ? (
          <div className="-mx-1 flex flex-wrap lg:-mx-4">
            {tokensCreated.map((token) => (
              <TokenCard key={token.id} token={token}></TokenCard>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center text-2xl font-bold">
            No tokens created
          </div>
        )}
      </div>
    </div>
  );
};
