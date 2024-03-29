import { Link } from "react-router-dom";
import { APP_NAME } from "../Config";
import { TERMS_ROUTE, PRIVACY_ROUTE } from "../navigation/Routes";

export const Footer = (): JSX.Element => {
  return (
    <div className="flex flex-row items-center justify-around p-6">
      <div>
        <img src="/images/logo_192.png" className="inline h-10 pr-3"></img>
        <span>© {APP_NAME} 2023</span>
      </div>
      <div className="flex">
        <div>
          <Link to={TERMS_ROUTE}>Terms</Link>
        </div>
        <div className="mx-3 font-light">|</div>
        <div>
          <Link to={PRIVACY_ROUTE}>Privacy</Link>
        </div>
      </div>
    </div>
  );
};
