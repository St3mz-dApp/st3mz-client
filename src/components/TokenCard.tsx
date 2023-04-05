import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Token } from "../models/Token";
import { DETAIL_ROUTE } from "../navigation/Routes";
import { getUri } from "../utils/util";
import { AudioTrack } from "./AudioTrack";

export const TokenCard = ({ token }: { token: Token }): JSX.Element => {
  return (
    <div
      className="group my-4 w-full px-4 transition-transform duration-300 ease-in-out 
        hover:-translate-y-1 md:w-1/2 xl:w-1/3"
    >
      <div className="overflow-hidden rounded-2xl bg-sec-bg px-6 py-4 shadow-lg">
        {token.metadata && (
          <>
            {token.metadata.image && (
              <Link to={DETAIL_ROUTE.replace(":id", token.id.toString())}>
                <img
                  className="mb-6 h-64 w-full rounded-xl object-cover object-center"
                  src={getUri(token.metadata.image)}
                />
              </Link>
            )}
            {token.metadata.file && (
              <AudioTrack url={getUri(token.metadata.file)} small={true} />
            )}
            <div>
              <span className="text-xl font-bold">{token.metadata.name}</span>
            </div>
          </>
        )}
        <div>
          <span>Price</span>
          <span className="font-bold">
            <img src="/images/matic.svg" className="mx-1 inline h-5" />
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
