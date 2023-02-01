import { Route, Routes } from "react-router-dom";
import { Navbar } from "./navigation/Navbar";
import { pages } from "./navigation/Pages";
import { NotFoundPage } from "./pages/NotFound";
import { Footer } from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BetaBanner } from "./components/BetaBanner";
import { NetworkBanner } from "./components/NetworkBanner";
import { getBannerDismissed } from "./utils/localStorage";

import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { APP_NAME, CHAINS } from "./Config";

const wagmiClient = createClient(
  getDefaultClient({
    appName: APP_NAME,
    chains: CHAINS,
  })
);

function App() {
  return (
    <div
      className="m-0 flex min-h-screen w-full flex-col justify-between p-0 font-sans 
        font-medium text-white"
    >
      <div>
        <WagmiConfig client={wagmiClient}>
          <ConnectKitProvider
            mode="dark"
            customTheme={{
              "--ck-font-family": `"Nunito", "system-ui", "-apple-system", 
                "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"`,
            }}
          >
            {!getBannerDismissed() && <BetaBanner />}
            <NetworkBanner />
            <Navbar />
            <div className="p-8 text-justify md:px-28 md:py-12">
              <Routes>
                {pages.map((page) => (
                  <Route
                    key={page.key}
                    path={page.route}
                    element={page.component}
                  />
                ))}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </ConnectKitProvider>
        </WagmiConfig>

        <ToastContainer
          position={toast.POSITION.BOTTOM_LEFT}
          newestOnTop
          pauseOnFocusLoss
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
