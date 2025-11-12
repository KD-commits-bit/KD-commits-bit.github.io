import "./App.css";
import CardComponent from "./components/CardComponent.jsx";
import NavbarComponent from "./components/NavbarComponent.jsx";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CarouselComponent from "./components/CarouselComponent.jsx";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
            <NavbarComponent />
            <header className="App-header" style={{textAlign: "center", paddingTop: '80px', marginBottom: "50px"}}>
              <CarouselComponent />
            </header>

            <section
              style={{
                minHeight: "100vh",
                backgroundColor: "#f9f9f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: "80%",
                margin: "0 auto",
                paddingBottom: "100px",
              }}
            >
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </section>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
      </Routes>
    </div>
  );
}

export default App;
