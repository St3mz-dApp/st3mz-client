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
        "flex items-center justify-center bg-secondary p-2",
        hidden && "hidden"
      )}
    >
      <MdErrorOutline className="mr-1 h-5 w-5" />
      <span>{APP_NAME} is currently in beta version.</span>
      <Button
        color="white"
        size="sm"
        className="ml-2 px-1 py-px font-semibold text-secondary"
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
