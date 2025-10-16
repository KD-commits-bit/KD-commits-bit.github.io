import "./App.css";
import CardComponent from "./components/CardComponent.jsx";
import NavbarComponent from "./components/NavbarComponent.jsx";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
            <NavbarComponent />
            <header className="App-header" style={{textAlign: 'center'}}>
              <h1>메인화면 사진 들어가면 좋을듯</h1>
              <p>이 화면은 React로 구성되었습니다.</p>
            </header>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: "80%",
                margin: "0 auto",
              }}
            >
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </div>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
      </Routes>
    </div>
  );
}

export default App;
