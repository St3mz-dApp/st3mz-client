import { useParams } from "react-router-dom";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider } from "wagmi";
import { backendUrl, getNetwork } from "../Config";
import { Token } from "../models/Token";
import utilContractData from "../contracts/St3mzUtil.json";
import st3mzContractData from "../contracts/St3mz.json";
import {
  getIpfsUri,
  launchToast,
  chainRespToToken,
  ToastType,
  trim,
  apiRespToToken,
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
      getTokensCreatedFromBackend();
      getTokensOwnedFromBackend();
    }
  }, [address]);

  // Get tokens owned by the account from backend
  const getTokensOwnedFromBackend = async () => {
    try {
      axios
        .get(`${backendUrl}/nft/owned-by/${address?.toLowerCase()}`)
        .then((resp) => {
          const _tokens = resp.data.map((item: any) => {
            return apiRespToToken(item);
          });
          setTokensOwned(_tokens);
        });
    } catch (e) {
      console.log(e);
      getTokensOwnedFromChain();
    }
  };

  // Get tokens created by the account from backend
  const getTokensCreatedFromBackend = async () => {
    try {
      axios
        .get(`${backendUrl}/nft/created-by/${address?.toLowerCase()}`)
        .then((resp) => {
          const _tokens = resp.data.map((item: any) => {
            return apiRespToToken(item);
          });
          debugger;
          setTokensCreated(_tokens);
        });
    } catch (e) {
      console.log(e);
      getTokensCreatedFromChain();
    }
  };

  // Get tokens owned by the account from the chain
  const getTokensOwnedFromChain = async () => {
    debugger;
    if (!provider) {
      return;
    }

    // Instantiate Util contract
    const utilContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).utilAddress,
      utilContractData.abi,
      provider
    );

    // Instantiate St3mz contract
    const st3mzContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).st3mzAddress,
      st3mzContractData.abi,
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
            meta = (await axios.get(getIpfsUri(_token.uri))).data;
          } catch (e) {
            console.log(e);
          }
          return { ..._token, metadata: meta };
        })
      );

      const hasBalance = await Promise.all(
        _tokens.map(async (token) => {
          const balance = await st3mzContract.balanceOf(address, token.id);
          return Number(balance) > 0;
        })
      );

      setTokensOwned(_tokens.filter((_v, index) => hasBalance[index]));
    } catch (e) {
      console.log(e);
      launchToast(
        "An error occurred fetching list of available items.",
        ToastType.Error
      );
    }
  };

  // Get list of tokens created by the account from the chain
  const getTokensCreatedFromChain = async () => {
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
            meta = (await axios.get(getIpfsUri(_token.uri))).data;
          } catch (e) {
            console.log(e);
          }
          return { ..._token, metadata: meta };
        })
      );

      setTokensCreated(_tokens.filter((token) => token.minter === address));
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
