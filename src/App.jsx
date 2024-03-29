import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Main from "./pages/main";
import DashBoard from "./pages/dashboard";
import Footer from "./components/Footer";
import Governance from "./pages/governance";
import Covers from "./pages/covers";
import Create from "./pages/create";
import Detail from "./pages/detail";
import FAQ from "./pages/faq";
import CoverWeth from "./pages/coverWeth";
import CoverUni from "./pages/coverUni";
import NftDetail from "./pages/nftDetail";
import CoverLink from "./pages/coverLink";
import CoverLido from "./pages/coverLido";
export const apiKey = process.env.REACT_APP_INFURA_KEY;
function App() {
  const [account, setAccount] = useState();

  return (
    <BrowserRouter>
      <Header account={account} setAccount={setAccount} />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Main />
            </div>
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <div>
              <DashBoard account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/covers"
          element={
            <div>
              <Covers account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/governance"
          element={
            <div>
              <Governance />
            </div>
          }
        ></Route>
        <Route
          path="/create"
          element={
            <div>
              <Create account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/governance/:id"
          element={
            <div>
              <Detail account={account} setAccount={setAccount} />
            </div>
          }
        ></Route>
        <Route
          path="/covers/weth"
          element={
            <div>
              <CoverWeth account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/covers/uni"
          element={
            <div>
              <CoverUni account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/covers/link"
          element={
            <div>
              <CoverLink account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/covers/lido"
          element={
            <div>
              <CoverLido account={account} />
            </div>
          }
        ></Route>
        <Route
          path="/faqs"
          element={
            <div>
              <FAQ />
            </div>
          }
        ></Route>
        <Route
          path="/detail/:tokenId"
          element={
            <div>
              <NftDetail account={account} />
            </div>
          }
        ></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
