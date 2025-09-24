/* eslint-disable */

import { useState } from "react";
import "./App.css";

function App() {
  let post = "강남 우동 맛집";

  let [글제목, 글제목변경] = useState([
    "남자 코트 추천",
    "강남 우동 맛집",
    "파이썬 독학",
  ]);

  let [따봉, 따봉변경] = useState([0, 0, 0]);
  let [modal, setModal] = useState(false);
  let [title, setTitle] = useState(0);
  let [입력값, 입력값변경] = useState('');
  let [date, setDate] = useState(new Date().toLocaleDateString());

  [1, 2, 3].map(function () {});

  return (
    <div className="App">
      <div className="black-nav">
        <h4>ReactBlog</h4>
      </div>

      <button
        onClick={() => {
          let copy = [...글제목];

          copy.sort();

          글제목변경(copy);
        }}
      >가나다순정렬</button>

      <button
        onClick={() => {
          let copy = [...글제목];

          copy[0] = "여자 코트 추천";

          글제목변경(copy);
        }}
      >글수정</button>
      {/*
      <div className="list">
        <h4>
          {글제목[0]}
          <span
            onClick={() => {
              따봉변경(따봉 + 1);
            }}
          >
            👍
          </span>
          {따봉}
        </h4>
        <p>2월 17일 발행</p>
      </div>

      <div className="list">
        <h4>{글제목[1]}</h4>
        <p>2월 17일 발행</p>
      </div>

      <div className="list">
        <h4
          onClick={() => {
            modal == true ? setModal(false) : setModal(true);
          }}
        >
          {글제목[2]}
        </h4>
        <p>2월 17일 발행</p>
      </div> 
      */}

      {글제목.map(function (a, i) {
        return (
          <div
            className="list"
            key={i}
          >
            <h4
              onClick={() => {
                setModal(true);
                setTitle(i);
              }}
            >
              {글제목[i]}
              <span
                onClick={(e) => {
                  e.stopPropagation();

                  let copy = [...따봉];

                  let a = copy[i] + 1;

                  copy[i] = a;

                  따봉변경(copy);
                }}
              >
                👍
              </span>
              {따봉[i]}
            </h4>
            <p>{date} 발행</p>
            <button onClick={(e) => {
              let copy = [...글제목];

              copy.splice(i, 1);

              글제목변경(copy);
            }}>삭제</button>
          </div>
        );
      })}

      <input type="text" onChange={(e) => {
        입력값변경(e.target.value);
      }} />

      <button onClick={() => {
        let copy = [...글제목];

        입력값 != '' ? copy.unshift(입력값) : alert('입력값 입력하셈');

        let copy2 = [...따봉];

        copy2.unshift(0);

        따봉변경(copy2);
        글제목변경(copy);
      }}>글발행</button>

      {
        modal == true ? <Modal title={title} 글제목={글제목} /> : null
      }
    </div>
  );
}

function Modal(props) {
  return (
    <>
      <div className="modal">
        <h4>{props.글제목[props.title]}</h4>
        <p>날짜</p>
        <p>상세내용</p>
      </div>
    </>
  );
}

export default App;
