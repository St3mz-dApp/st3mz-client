import { Link } from "react-router-dom";
import { APP_NAME } from "../Config";
import { TERMS_ROUTE, PRIVACY_ROUTE } from "../navigation/Routes";

export const Footer = (): JSX.Element => {
  return (
    <div className="flex flex-row justify-around items-center p-6 font-light">
      <div>
        <img src="/images/logo_192.png" className="h-10 inline pr-3"></img>
        <span>© {APP_NAME} 2022</span>
      </div>
      <div>
        <div>
          <Link to={TERMS_ROUTE}>Terms</Link>
        </div>
        <div className="pt-1">
          <Link to={PRIVACY_ROUTE}>Privacy</Link>
        </div>
      </div>
    </div>
  );
};
