import { Button, Input } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNetwork, useSigner, useProvider } from "wagmi";
import { backendUrl, getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import utilContractData from "../contracts/St3mzUtil.json";
import { Token } from "../models/Token";
import {
  getIpfsUri,
  launchToast,
  chainRespToToken,
  ToastType,
  trim,
  apiRespToToken,
} from "../utils/util";
import axios from "axios";
import { AudioTrack } from "../components/AudioTrack";
import { MdOpenInNew } from "react-icons/md";
import { Spinner } from "../components/common/Spinner";

export const TokenDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { chain: activeChain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [token, setToken] = useState<Token>();
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) getTokenFromBackend();
  }, [id]);

  useEffect(() => {
    if (signer && activeChain) getBalance();
  }, [signer, activeChain]);

  // Get tokens from backend
  const getTokenFromBackend = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/nft/${id}`);
      setToken(apiRespToToken(resp.data));
    } catch (e) {
      console.log(e);
      getTokenFromChain();
    }
  };

  // Get token data from contract
  const getTokenFromChain = async () => {
    if (!provider) return;

    // Instantiate St3mz contract
    const utilContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).utilAddress,
      utilContractData.abi,
      provider
    );

    // Call getToken() on contract and get metadata from IPFS
    try {
      const _token = chainRespToToken(await utilContract.getToken(id));
      const { data: metadata } = await axios.get(getIpfsUri(_token.uri));
      _token.metadata = metadata;
      setToken(_token);
    } catch (e) {
      console.log(e);
      launchToast("An error occurred fetching item data.", ToastType.Error);
    }
  };

  // Get signer's token balance
  const getBalance = async () => {
    if (!signer || !activeChain) return;

    // Instantiate St3mz contract
    const st3mzContract = new Contract(
      getNetwork(activeChain.id).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    // Call balanceOf() on contract
    try {
      const resp = await st3mzContract.balanceOf(await signer.getAddress(), id);
      setBalance(resp.toNumber());
    } catch (e) {
      console.log(e);
    }
  };

  // Buy token token
  const buy = async () => {
    if (!signer || !activeChain || !token || !amount) return;

    // Instantiate St3mz contract
    const st3mzContract = new Contract(
      getNetwork(activeChain.id).st3mzAddress,
      st3mzContractData.abi,
      signer
    );

    // Call buy() on contract
    try {
      const tx = await st3mzContract.buy(id, amount, {
        value: token.price.mul(amount).toString(),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      launchToast("Order completed with success.");
      getTokenFromChain();
      getBalance();
    } catch (err: any) {
      // Manage errors
      let errorMessage = "An error occurred buying the item.";
      if (err.error && err.error.data && err.error.data.data) {
        const error = st3mzContract.interface.parseError(err.error.data.data);
        switch (error.name) {
          case "St3mz__InvalidValueSent":
            errorMessage = "The value sent is not correct.";
            break;
          case "St3mz__AmountZero":
            errorMessage = "Units must be greater than zero.";
            break;
          case "St3mz__AmountNotAvailable":
            errorMessage = "There are not enough units available.";
            break;
          default:
            console.log(err);
        }
      } else {
        console.log(err);
      }

      setLoading(false);
      launchToast(errorMessage, ToastType.Error);
    }
  };

  return (
    <div className="lg:flex">
      {token?.metadata && (
        <>
          {/* Left column */}
          <div className="lg:w-2/5">
            <div className="mb-5">
              <div className="mb-2 text-4xl font-bold">
                {token.metadata.name}
              </div>
              <AudioTrack url={getIpfsUri(token.metadata.file)} />
            </div>
            {token.metadata.image && (
              <img
                className="rounded-xl"
                src={getIpfsUri(token.metadata.image)}
              />
            )}
            <div className="my-3">
              <span className="text-lg font-light">
                {token.metadata.description}
              </span>
            </div>
            <div>
              <span>Creator</span>{" "}
              <span className="text-xl font-bold">{trim(token.minter)}</span>
            </div>
            <div>
              <span>Duration</span>{" "}
              <span className="text-xl font-bold">
                {token.metadata.duration}
              </span>{" "}
              <span className="text-xl">secs.</span>
            </div>
            <div>
              <span>Format</span>{" "}
              <span className="text-xl font-bold">{token.metadata.format}</span>
            </div>
            <div>
              <span>Genre</span>{" "}
              <span className="text-xl font-bold">{token.metadata.genre}</span>
            </div>
            <div>
              <span>BPM</span>{" "}
              <span className="text-xl font-bold">{token.metadata.bpm}</span>
            </div>
            <div>
              <span>Supply</span>{" "}
              <span className="text-xl font-bold">{token.supply}</span>
            </div>
            <div>
              <span>Available</span>{" "}
              <span className="text-xl font-bold">{token.available}</span>
            </div>
            <div>
              <span>IPFS link</span>{" "}
              <a href={getIpfsUri(token.uri)} target="_blank">
                <MdOpenInNew className="-mt-1 inline h-6 w-6 cursor-pointer text-secondary" />
              </a>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:w-3/5 lg:pl-16">
            <div className="mt-4 mb-2 border-b border-b-secondary text-2xl">
              Stems
            </div>
            {token.metadata.stems.map((stem, index) => (
              <div className="py-2" key={index}>
                <div>{stem.description}</div>
                <AudioTrack url={getIpfsUri(stem.file)} />
              </div>
            ))}

            <div className="mt-4 md:flex">
              <div className="md:w-1/2">
                <div className="mt-2 border-b border-b-secondary text-2xl">
                  Licenses
                </div>
                {token.metadata.licenses.map((license, index) => (
                  <div key={index}>
                    {license.type}{" "}
                    <span className="text-xl font-bold">
                      {license.tokensRequired}
                    </span>{" "}
                    <span className="text-xl">
                      {license.tokensRequired > 1 ? "tokens" : "token"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col items-center justify-center md:mt-0 md:w-1/2">
                <div className="mb-4 rounded-xl border-2 border-primary p-2">
                  <span>Unit price</span>
                  <span className="text-xl font-bold">
                    <img src="/images/FTM.svg" className="mx-1 inline h-5" />
                    {ethers.utils.formatEther(token.price)}
                  </span>
                </div>
                {token.available > 0 ? (
                  <div className="flex">
                    {loading ? (
                      <Spinner message="Processing order..." />
                    ) : (
                      <>
                        <div className="mr-2">
                          <Input
                            variant="outlined"
                            label="Number of units"
                            size="lg"
                            type="number"
                            color="orange"
                            className="error bg-sec-bg !text-white"
                            onChange={(e) =>
                              setAmount(Number(e.target.value) || 0)
                            }
                          />
                        </div>
                        <Button color="yellow" onClick={buy}>
                          Buy
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-xl font-bold">Sold out</div>
                )}
              </div>
            </div>
            {balance > 0 && (
              <div className="mt-8">
                <span className="rounded-xl border-2 border-secondary p-2 text-2xl">
                  <span>My balance:</span>
                  <span className="ml-1">
                    <span className="font-bold text-secondary">{balance}</span>{" "}
                    {balance == 1 ? <span>token</span> : <span>tokens</span>}
                  </span>
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
