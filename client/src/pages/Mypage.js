import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from "react-router";

axios.defaults.withCredentials = true;

const MypageWrap = styled.div`
  width: 100%;
  margin: 0 auto;
  min-height: 55vh;
  font-size: max(16px, 0.8vw);
`;
const MypageContent = styled.div`
  width: 75%;
  min-width: 200px;
  margin: 0 auto;
`;
const UserContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1vw 0;
  border-bottom: 3px solid #000;
  margin-bottom: 2vw;
  > p {
    line-height: 20px;
    font-size: max(0.9vw, 13px);
    padding: 10px 0;
    > span {
      font-weight: 700;
    }
  }
  > select {
    width: max(5vw, 60px);
    height: max(2vw, 20px);
    background-color: white;
    border-radius: 20px;
    outline: none;
    cursor: pointer;
    text-align-last: center;
    text-align: center;
    border: 2px solid black;
    -ms-text-align-last: center;
    -moz-text-align-last: center;
    font-size: max(0.8vw, 10px);
  }
`;

const ContentList = styled.ul`
  display: flex;
  flex-direction: column;
  > .content {
    display: flex;
    /* justify-content: space-between; */
    padding: 1vw 0;
    border-bottom: 3px solid #000;
    cursor: pointer;
    > input {
      /* flex: 1 1 auto; */
    }
    > .contentInfo {
      /* flex: 5 1 auto; */
      display: flex;
      width: 100%;
      text-align: center;
      > p {
        /* flex: 1 1 auto; */
        text-align: center;
        width: 25%;
      }
      > p:nth-child(2) {
        /* flex: 5 1 auto; */
        width: 50%;
      }
    }
  }
`;
const ContentCheck = styled.div`
  display: flex;
  justify-content: space-between;
  > button {
    width: 9vw;
    min-width: 75px;
    background-color: #000;
    color: #fff;
    border: 2px solid black;
    height: 5vh;
    box-sizing: border-box;
    border-radius: 5vh;
    word-break: keep-all;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 30px;
  }
  > button:hover {
    color: #000;
    background-color: rgba(255, 255, 255, 0.5);
    font-weight: bold;
    border: 2px solid black;
  }
`;

function Mypage({
  userContent,
  setUserContent,
  setAccToken,
  isLogin,
  accToken,
  setMoreClickModal,
  setCurrResult,
  setEditResult,
  setEditContentModal,
}) {
  const url = process.env.REACT_APP_API_URL || `http://localhost:4000`;
  const [gotDeleted, setGotDeleted] = useState(false); // ????????? ??????????????? ???????????? state
  const [orderBy, setOrderBy] = useState("byDates"); // ????????? ?????? ??????
  const [checkedItems, setCheckedItems] = useState(
    userContent.data.map((el) => el.id)
  );
  // console.log(userContent.data);

  const ordering = (value) => {
    if (value === "byThumbsup") {
      setOrderBy("byThumbsup");
      setUserContent({
        data: userContent.data.sort((a, b) => b.thumbsup - a.thumbsup),
      });
    } else if (value === "byDates") {
      setOrderBy("byDates");
      setUserContent({
        data: userContent.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      });
    }
  };

  const readResult = (ele) => {
    setCurrResult({ data: ele });
    setMoreClickModal(true);
  }; // ?????? ?????? ?????? ????????? ??????

  const editResult = (ele) => {
    setEditResult({ data: ele });
    setEditContentModal(true);
  }; // ?????? ?????? ????????? ??????

  const handleCheckChange = (checked, id) => {
    if (checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    }
  };

  const handleAllCheck = (checked) => {
    if (checked) {
      setCheckedItems(userContent.data.map((el) => el.id));
    } else {
      setCheckedItems([]);
    }
  };

  const deleteContent = async () => {
    try {
      await axios.post(
        `${url}/contents/delete`,
        {
          contentId: checkedItems,
        },
        {
          headers: { authorization: `Bearer ${accToken}` },
        }
      );

      alert("?????? ?????????????????????.");
      setGotDeleted(!gotDeleted);

      let userContent = await axios.get(`${url}/myContents`, {
        headers: { authorization: `Bearer ${accToken}` },
      });
      if (userContent.data.accessToken) {
        setAccToken(userContent.data.accessToken);
      }
      setUserContent({
        data: userContent.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      });
    } catch (error) {
      console.log(error);
      alert("?????? ??????????????????.");
    }
  }; // ?????? ??? ????????????

  const contentCount = userContent.data.length; // ?????? ??? ???
  const contentThumbsupCount = userContent.data.reduce((acc, cur) => {
    if (acc < cur.thumbsup) return cur.thumbsup;
    else return acc;
  }, 0); // ?????? ?????????

  return (
    <>
      {isLogin ? (
        <MypageWrap>
          <MypageContent>
            {" "}
            {/* ?????? ??? ??? ?????? */}
            <div id="allCheck">
              <input
                type="checkbox"
                checked={
                  checkedItems.length === userContent.data.length ? true : false
                }
                onChange={(e) => handleAllCheck(e.target.checked)}
              />
              ?????? ??????
            </div>
            <UserContent>
              <p>
                ???????????? ?????? <span>{contentCount}???</span> ??????, ?????? ????????????{" "}
                <span>{contentThumbsupCount}???</span> ?????????
              </p>
              <select
                value={orderBy}
                onChange={(e) => ordering(e.target.value)}
              >
                <option value="byThumbsup">????????? ???</option>
                <option defaultValue value="byDates">
                  ?????????
                </option>
              </select>
            </UserContent>
            <ContentList>
              {userContent.data.map((ele, idx) => {
                return (
                  <li className="content" key={idx}>
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(ele.id) ? true : false}
                      onChange={(e) =>
                        handleCheckChange(e.target.checked, ele.id)
                      }
                    />
                    <div className="contentInfo">
                      <p onClick={() => readResult(ele)}>{ele.wordName}</p>
                      <p>{ele.wordMean}</p>
                      <p>{ele.thumbsup}</p>
                      <p onClick={() => editResult(ele)}>????????????</p>
                    </div>
                  </li>
                );
              })}
            </ContentList>
            <ContentCheck>
              <button id="delete" onClick={() => deleteContent()}>
                ??????
              </button>
            </ContentCheck>
          </MypageContent>
        </MypageWrap>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

export default Mypage;
