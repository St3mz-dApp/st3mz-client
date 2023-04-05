import { polygon, polygonMumbai, foundry } from "@wagmi/core/chains";

export const APP_NAME = "St3mz";

export const ipfsGatewayUrl = "https://nftstorage.link/ipfs/";

export const backendUrl = "https://www.whatswapz.com";

var availableChains =
  process.env.NODE_ENV === "development"
    ? [polygonMumbai, polygon, foundry]
    : [polygon];
export const CHAINS = availableChains;

export interface Network {
  chainId: number;
  name: string;
  st3mzAddress: string;
  utilAddress: string;
}

const networks: Network[] = [
  {
    chainId: foundry.id,
    name: "Local network",
    st3mzAddress: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    utilAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  {
    chainId: polygonMumbai.id,
    name: "Testnet",
    st3mzAddress: "0xf8ba37b852c05ef755865d06d2911b840433c2e4",
    utilAddress: "0x8e542a5e13df14b2c6cdd2eb07ada4bce879df38",
  },
  {
    chainId: polygon.id,
    name: "Mainnet",
    st3mzAddress: "0xd89e04f2ddf5f8212461d27584216f00ab6e96f4",
    utilAddress: "0x2da83a100e25ad3a2ea58967d37f8439a33de4fb",
  },
];

export const getNetwork = (chainId: number): Network => {
  return networks.find((n) => n.chainId === chainId) as Network;
};
