import { fantom, fantomTestnet, foundry } from "@wagmi/core/chains";

export const APP_NAME = "St3mz";

export const ipfsGatewayUrl = "https://nftstorage.link/ipfs/";

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
    st3mzAddress: "0x36d392a5da9817e8d91498a47c852c25f7a2073e",
    utilAddress: "0x16343ed8aa81aba9873ed9402979580a709de5e1",
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
