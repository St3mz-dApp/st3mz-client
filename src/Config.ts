import { chain as wagmiChains } from "wagmi";

export const APP_NAME = "St3mz";

export const ipfsGatewayUrl = "https://nftstorage.link/ipfs/";

var availableChains = [wagmiChains.polygonMumbai, wagmiChains.polygon];
if (process.env.NODE_ENV === "development") {
  availableChains.push(wagmiChains.foundry);
}
export const CHAINS = availableChains;
export type ChainId = typeof CHAINS[number]["id"];

export interface Network {
  chainId: ChainId;
  name: string;
  st3mzAddress: string;
  utilAddress: string;
}

const networks: Network[] = [
  {
    chainId: wagmiChains.foundry.id,
    name: "Local network",
    st3mzAddress: "0x36d392a5da9817e8d91498a47c852c25f7a2073e",
    utilAddress: "0x16343ed8aa81aba9873ed9402979580a709de5e1",
  },
  {
    chainId: wagmiChains.polygonMumbai.id,
    name: "Testnet",
    st3mzAddress: "0xf8ba37b852c05ef755865d06d2911b840433c2e4",
    utilAddress: "0x8e542a5e13df14b2c6cdd2eb07ada4bce879df38",
  },
  {
    chainId: wagmiChains.polygon.id,
    name: "Mainnet",
    st3mzAddress: "0xd89e04f2ddf5f8212461d27584216f00ab6e96f4",
    utilAddress: "0x2da83a100e25ad3a2ea58967d37f8439a33de4fb",
  },
];

export const getNetwork = (chainId: ChainId): Network => {
  return networks.find((n) => n.chainId === chainId) as Network;
};
