import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { APP_NAME } from "../Config";
import { setBannerDismissed } from "../utils/localStorage";
import { classNames } from "../utils/util";

export const BetaBanner = (): JSX.Element => {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className={classNames(
        "flex justify-center items-center bg-secondary p-2",
        hidden && "hidden"
      )}
    >
      <MdErrorOutline className="h-5 w-5 mr-1" />
      <span>{APP_NAME} is currently in beta version.</span>
      <Button
        color="white"
        size="sm"
        className="ml-2 px-1 py-px text-secondary font-semibold"
        onClick={() => {
          setBannerDismissed();
          setHidden(true);
        }}
      >
        OK
      </Button>
    </div>
  );
};
