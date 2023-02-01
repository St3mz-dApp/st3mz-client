import { Disclosure } from "@headlessui/react";
import { MdMenu, MdClose } from "react-icons/md";
import { pages } from "./Pages";
import { Link, NavLink } from "react-router-dom";
import { classNames } from "../utils/util";
import { ConnectKitButton } from "connectkit";

export const Navbar = (): JSX.Element => {
  return (
    <>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <MdClose className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MdMenu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <img
                        className="hidden h-8 w-auto sm:block lg:hidden"
                        src="/images/logo_192.png"
                      />
                      <img
                        className="hidden h-8 w-auto pl-2 lg:block"
                        src="/images/logo_full.png"
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {pages.map(
                        (page) =>
                          page.showInMenu &&
                          page.key !== "home" && (
                            <NavLink
                              key={page.key}
                              to={page.route}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "border-yellow-400 text-yellow-400"
                                    : "border-transparent text-primary hover:text-yellow-400",
                                  "block border-b-4 px-3 py-2 text-xl font-medium"
                                )
                              }
                            >
                              <span className="relative top-1">
                                {page.label}
                              </span>
                            </NavLink>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <ConnectKitButton
                    showBalance={true}
                    label="⚡ Connect"
                  ></ConnectKitButton>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {pages.map(
                  (page) =>
                    page.showInMenu && (
                      <NavLink
                        key={page.key}
                        to={page.route}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-primary text-white"
                              : "bg-blue-gray-900 text-gray-300 hover:text-white",
                            "flex justify-center px-3 py-2 font-medium"
                          )
                        }
                      >
                        {page.label}
                      </NavLink>
                    )
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};
