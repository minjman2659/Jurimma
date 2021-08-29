import "./app.css";
import dummyData from "./dummy/dummyData";
import Search from "./pages/Search";
import SearchMore from "./pages/SearchMore";
import { useState } from "react";
import Nav from "./comp/Nav";
import Modal from "./comp/Modal";
import Mypage from "./pages/Mypage";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import WriteModal from "./comp/WriteModal";
import MypageEdit from "./pages/MypageEdit";

function App() {
  // console.log(dummyData);
  const [isLogin, setisLogin] = useState(true);
  const [searched, setSearched] = useState(false);
  const [onModal, setOnModal] = useState(true);
  const [writeModal, setWriteModal] = useState(false);

  return (
    <BrowserRouter>
      <div id="wrap">
        {onModal ? <Modal setOnModal={setOnModal} /> : null}
        {writeModal ? <WriteModal /> : null}
        <Nav isLogin={isLogin} setOnModal={setOnModal} />

        <div className="exNav">
          <header>
            <Link to="/">
              <h1 id="jurimma"></h1>
            </Link>
          </header>

          <Switch>
            <>
              <Route path="/mypage">
                <Mypage />
              </Route>
              <Route path="/mypageEdit">
                <MypageEdit />
              </Route>
              <Route exact path="/">
                {isLogin === true && searched === true ? (
                  <SearchMore data={dummyData.word} />
                ) : (
                  <Search data={dummyData.word} />
                )}
              </Route>
              <footer>copyright JURIMMA</footer>
            </>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
