import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Token } from "../models/Token";
import { DETAIL_ROUTE } from "../navigation/Routes";
import { getIpfsUri } from "../utils/util";
import { AudioTrack } from "./AudioTrack";

export const TokenCard = ({ token }: { token: Token }): JSX.Element => {
  return (
    <div
      className="group my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 transition-transform 
    ease-in-out hover:-translate-y-1 duration-300"
    >
      <div className="rounded-2xl shadow-lg bg-sec-bg px-6 py-4 overflow-hidden">
        {token.metadata && (
          <>
            {token.metadata.image && (
              <Link to={DETAIL_ROUTE.replace(":id", token.id.toString())}>
                <img
                  className="w-full h-64 object-cover object-center mb-6 rounded-xl"
                  src={getIpfsUri(token.metadata.image)}
                />
              </Link>
            )}
            {token.metadata.file && (
              <AudioTrack url={getIpfsUri(token.metadata.file)} small={true} />
            )}
            <div>
              <span className="text-xl font-bold">{token.metadata.name}</span>
            </div>
          </>
        )}
        <div>
          <span>Price</span>
          <span className="font-bold">
            <img src="/images/FTM.svg" className="mx-1 h-5 inline" />
            {ethers.utils.formatEther(token.price)}
          </span>
        </div>
        <div>
          <span>Supply</span> <span className="font-bold">{token.supply}</span>
        </div>
        <div>
          <span>Available</span>{" "}
          <span className="font-bold">{token.available}</span>
        </div>
      </div>
    </div>
  );
};
