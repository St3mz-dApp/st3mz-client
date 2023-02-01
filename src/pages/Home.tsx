export const HomePage = (): JSX.Element => {
  return (
    <div>
      <img
        src="/images/logo_full.png"
        alt="logo"
        className="lg:w-1/2 mx-auto mb-12"
      />
      <div className="md:mx-8 text-lg">
        <div className="rounded-2xl shadow-lg bg-sec-bg p-6 pt-4 lg:w-3/5 mb-6">
          <div className="text-3xl font-bold border-b border-primary mb-2">
            Music NFTs
          </div>
          <div className="mb-1">
            Every <span className="font-bold text-secondary">NFT</span> is
            composed of:
          </div>
          <ul className="list-disc pl-5">
            <li>Main audio track</li>
            <li>Stem files that form the main audio track</li>
            <li>Cover artwork</li>
            <li>Metadata of the audio track</li>
          </ul>
          <div className="mt-2">
            All the files are stored on{" "}
            <span className="font-bold text-secondary">IPFS</span> and the NFT
            is minted on{" "}
            <span className="font-bold text-secondary">Fantom blockchain</span>.
          </div>
        </div>
        <div className="rounded-2xl shadow-lg bg-sec-bg p-6 pt-4 lg:w-3/5 mb-6 ml-auto">
          <div className="text-3xl font-bold border-b border-primary mb-2">
            Different licenses
          </div>
          <div className="mb-1">
            Different types of license will apply{" "}
            <span className="font-bold text-secondary">
              depending on the number of units owned
            </span>
            . Every license offers different rights over the material:
          </div>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-bold text-secondary">Basic:</span> Does NOT
              allow commercial use.
            </li>
            <li>
              <span className="font-bold text-secondary">Commercial:</span>{" "}
              Allows commercial use. The rights over the material are shared
              with other people.
            </li>
            <li>
              <span className="font-bold text-secondary">Exclusive:</span>{" "}
              Exclusive rights over the material with no limitations.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
