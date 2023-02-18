import { fantom, fantomTestnet, foundry } from "@wagmi/core/chains";

export const APP_NAME = "St3mz";

export const ipfsGatewayUrl = "https://nftstorage.link/ipfs/";

export const backendUrl = "http://localhost:8080";

var availableChains =
  process.env.NODE_ENV === "development"
    ? [fantomTestnet, fantom, foundry]
    : [fantomTestnet, fantom];
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
    chainId: fantomTestnet.id,
    name: "Testnet",
    st3mzAddress: "0xde619f24562251520058773d3625b00716ce804b",
    utilAddress: "0xecf1ff305d570585885f6078cff66a678777b10b",
  },
  {
    chainId: fantom.id,
    name: "Mainnet",
    st3mzAddress: "0x0",
    utilAddress: "0x0",
  },
];

export const getNetwork = (chainId: number): Network => {
  return networks.find((n) => n.chainId === chainId) as Network;
};
