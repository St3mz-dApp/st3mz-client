import { Button, Input } from "@material-tailwind/react";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNetwork, useSigner, useProvider } from "wagmi";
import { getNetwork } from "../Config";
import st3mzContractData from "../contracts/St3mz.json";
import utilContractData from "../contracts/St3mzUtil.json";
import { Token } from "../models/Token";
import {
  getIpfsUri,
  launchToast,
  respToToken,
  ToastType,
  trim,
} from "../utils/util";
import axios from "axios";
import { Metadata } from "../models/Metadata";
import { AudioTrack } from "../components/AudioTrack";
import { MdOpenInNew } from "react-icons/md";
import { Spinner } from "../components/common/Spinner";

export const TokenDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { chain: activeChain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [token, setToken] = useState<Token>();
  const [metadata, setMetadata] = useState<Metadata>();
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) getToken();
  }, [id]);

  useEffect(() => {
    if (token) getMetadata();
  }, [token]);

  useEffect(() => {
    if (signer && activeChain) getBalance();
  }, [signer, activeChain]);

  // Get token data from contract
  const getToken = async () => {
    if (!provider) return;

    // Instantiate St3mz contract
    const utilContract = new Contract(
      getNetwork(activeChain?.id || provider.network.chainId).utilAddress,
      utilContractData.abi,
      provider
    );

    // Call getTokens() on contract
    try {
      const resp = await utilContract.getToken(id);
      setToken(respToToken(resp));
    } catch (e) {
      console.log(e);
      launchToast("An error occurred fetching item data.", ToastType.Error);
    }
  };

  // Get token metadata from IPFS
  const getMetadata = async () => {
    const { data } = await axios.get(getIpfsUri(token!.uri));
    setMetadata(data);
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
      getToken();
      getBalance();
    } catch (e) {
      console.log(e);
      setLoading(false);
      launchToast("An error occurred buying the item.", ToastType.Error);
    }
  };

  return (
    <div className="flex">
      {token && metadata && (
        <>
          {/* Left column */}
          <div className="w-2/5">
            {metadata.image && (
              <img className="rounded-xl" src={getIpfsUri(metadata.image)} />
            )}
            <div className="my-3">
              <span className="text-lg font-light">{metadata.description}</span>
            </div>
            <div>
              <span>Creator</span>{" "}
              <span className="text-xl font-bold">{trim(token.minter)}</span>
            </div>
            <div>
              <span>Duration</span>{" "}
              <span className="text-xl font-bold">{metadata.duration}</span>{" "}
              <span className="text-xl">secs.</span>
            </div>
            <div>
              <span>Format</span>{" "}
              <span className="text-xl font-bold">{metadata.format}</span>
            </div>
            <div>
              <span>Genre</span>{" "}
              <span className="text-xl font-bold">{metadata.genre}</span>
            </div>
            <div>
              <span>BPM</span>{" "}
              <span className="text-xl font-bold">{metadata.bpm}</span>
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
          <div className="w-3/5 pl-16">
            <div className="mb-4">
              <span className="text-4xl font-bold">{metadata.name}</span>
            </div>
            <AudioTrack url={getIpfsUri(metadata.file)} />
            <div className="mt-4 mb-2 border-b border-b-secondary text-2xl">
              Stems
            </div>
            {metadata.stems.map((stem, index) => (
              <div className="py-2" key={index}>
                <div>{stem.description}</div>
                <AudioTrack url={getIpfsUri(stem.file)} />
              </div>
            ))}

            <div className="mt-4 flex">
              <div className="w-1/2">
                <div className="mt-2 border-b border-b-secondary text-2xl">
                  Licenses
                </div>
                {metadata.licenses.map((license, index) => (
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
              <div className="flex w-1/2 flex-col items-center justify-center">
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
