import { useParams } from "react-router-dom";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNetwork, useProvider, useSigner } from "wagmi";
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
import { Button } from "@material-tailwind/react";

export const AccountPage = (): JSX.Element => {
  const { address } = useParams<{ address: string }>();
  const provider = useProvider();
  const [tokensCreated, setTokensCreated] = useState<Token[]>([]);
  const [tokensOwned, setTokensOwned] = useState<Token[]>([]);
  const [withdrawableBalance, setWithdrawableBalance] = useState<string>();
  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (address) {
      getTokensCreatedFromBackend();
      getTokensOwnedFromBackend();
      getWithdrawableBalance();
    }
  }, [address]);

  // Get withdrawable balance from contract
  const getWithdrawableBalance = async (): Promise<void> => {
    if (!provider) {
      return;
    }

    // Instantiate St3mz contract
    const st3mzContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).st3mzAddress,
      st3mzContractData.abi,
      provider
    );

    try {
      const contractBalance = await st3mzContract.withdrawableBalance(address);
      console.log("contractBalance", contractBalance);
      setWithdrawableBalance(
        Number(ethers.utils.formatEther(contractBalance)).toFixed(2)
      );
    } catch (e) {
      console.log(e);
    }
  };

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
          setTokensCreated(_tokens);
        });
    } catch (e) {
      console.log(e);
      getTokensCreatedFromChain();
    }
  };

  // Get tokens owned by the account from the chain
  const getTokensOwnedFromChain = async () => {
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

  // Withdraw available balance from contract
  const withdraw = async (): Promise<void> => {
    if (!signer) {
      launchToast("Please connect to your account.", ToastType.Error);
      return;
    }
    // Instantiate St3mz contract with signer
    const st3mzContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    try {
      const tx = await st3mzContract.withdraw();
      await tx.wait();
      launchToast("Withdrawal successful.");
    } catch (err: any) {
      // Manage errors
      let errorMessage = "An error occurred withdrawing from contract.";
      if (err.error && err.error.data && err.error.data.data) {
        const error = st3mzContract.interface.parseError(err.error.data.data);
        switch (error.name) {
          case "St3mz__BalanceZero":
            errorMessage = "Withdrawable balance in contract is zero.";
            break;
          default:
            console.log(err);
        }
      } else {
        console.log(err);
      }
      launchToast(errorMessage, ToastType.Error);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <h1 className="title-gradient">
          Account {address ? trim(address) : ""}
        </h1>
      </div>
      <div className="container mx-auto my-4 lg:my-12 xl:px-12">
        {withdrawableBalance && Number(withdrawableBalance) > 0 && (
          <div className="mb-6">
            <span className="text-sec-text">Withdrawable balance: </span>
            <img src="/images/FTM.svg" className="mx-1 inline h-5" />
            <span>{withdrawableBalance}</span>
            <Button
              color="orange"
              size="sm"
              className="ml-2 rounded-full px-2 py-1 text-xs"
              onClick={() => withdraw()}
            >
              Withdraw
            </Button>
          </div>
        )}
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
