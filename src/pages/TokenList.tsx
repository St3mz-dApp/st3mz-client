import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider } from "wagmi";
import { backendUrl, getNetwork } from "../Config";
import { Token } from "../models/Token";
import utilContractData from "../contracts/St3mzUtil.json";
import {
  getUri,
  launchToast,
  apiRespToToken,
  chainRespToToken,
  ToastType,
} from "../utils/util";
import { TokenCard } from "../components/TokenCard";
import axios from "axios";

export const TokenListPage = (): JSX.Element => {
  const provider = useProvider();
  const [tokens, setTokens] = useState<Token[]>([]);
  const { chain: activeChain } = useNetwork();

  useEffect(() => {
    getTokensFromBackend();
  }, []);

  // Get tokens from backend
  const getTokensFromBackend = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/nft`);
      const _tokens = resp.data.map((item: any) => {
        return apiRespToToken(item);
      });
      setTokens(_tokens);
    } catch (e) {
      console.log(e);
      getTokensFromChain();
    }
  };

  // Get list of tokens from contract
  const getTokensFromChain = async () => {
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
          const _token = chainRespToToken(item);
          let meta;
          try {
            meta = (await axios.get(getUri(_token.uri))).data;
          } catch (e) {
            console.log(e);
          }
          return { ..._token, metadata: meta };
        })
      );

      setTokens(_tokens);
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
      <div className="flex justify-center">
        <h1 className="title-gradient">Browse NFTs</h1>
      </div>
      <div className="container mx-auto my-4 lg:my-12 xl:px-12">
        <div className="-mx-1 flex flex-wrap lg:-mx-4">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token}></TokenCard>
          ))}
        </div>
      </div>
    </div>
  );
};
