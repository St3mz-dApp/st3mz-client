import { HomePage } from "../pages/Home";
import { PrivacyPage } from "../pages/Privacy";
import { TermsPage } from "../pages/Terms";
import {
  HOME_ROUTE,
  LIST_ROUTE,
  CREATE_ROUTE,
  DETAIL_ROUTE,
  PRIVACY_ROUTE,
  TERMS_ROUTE,
} from "./Routes";
import { TokenListPage } from "../pages/TokenList";
import { TokenDetailPage } from "../pages/TokenDetail";
import { CreatePage } from "../pages/Create";
export interface Page {
  key: string;
  route: string;
  component: JSX.Element;
  showInMenu: boolean;
  icon?: string;
  label?: string;
}

export const pages: Page[] = [
  {
    key: "home",
    route: HOME_ROUTE,
    component: <HomePage />,
    showInMenu: false,
  },
  {
    key: "browse",
    route: LIST_ROUTE,
    component: <TokenListPage />,
    showInMenu: true,
    label: "Browse",
  },
  {
    key: "create",
    route: CREATE_ROUTE,
    component: <CreatePage />,
    showInMenu: true,
    label: "Create",
  },
  {
    key: "detail",
    route: DETAIL_ROUTE,
    component: <TokenDetailPage />,
    showInMenu: false,
  },
  {
    key: "privacy",
    route: PRIVACY_ROUTE,
    component: <PrivacyPage />,
    showInMenu: false,
  },
  {
    key: "terms",
    route: TERMS_ROUTE,
    component: <TermsPage />,
    showInMenu: false,
  },
];
