import { ethers } from "ethers";
import { Metadata } from "./Metadata";

export interface Token {
  id: number;
  minter: string;
  uri: string;
  price: ethers.BigNumber;
  supply: number;
  available: number;
  metadata?: Metadata;
}
