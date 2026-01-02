import "./App.css";
import CardComponent from "./components/CardComponent.jsx";
import NavbarComponent from "./components/NavbarComponent.jsx";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CarouselComponent from "./components/CarouselComponent.jsx";
import axios from "axios";
import {useState, useEffect} from "react";
import Mypage from "./pages/Mypage.jsx";
import CarDetailPage from "./pages/CarDetailPage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import {useAuth} from "./hooks/useAuth.js";
import AdminPage from "./pages/AdminPage.jsx";
import CarRegisterPage from "./pages/CarRegisterPage.jsx";
import ProtectedRoute  from "./routes/ProtectedRoute.jsx";
import CarPurchase from "./pages/CarPurchase.jsx";
import AdminCarListPage from "./pages/AdminCarListPage.jsx";



function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();

  useEffect(() => {
    axios.get("http://localhost:8080/api/car/all")
      .then((response) => {
        setCars(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching car data:", e);
        setError(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
            <NavbarComponent/>
            <header className="App-header" style={{textAlign: "center", paddingTop: '80px', marginBottom: "50px"}}>
              <CarouselComponent/>
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
              {cars.map((car) => (
                <CardComponent key={car.carId} car={car}/>
              ))}
            </section>
          </>
        }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/mypage" element={
          <>
            <NavbarComponent/>
            <Mypage user={user}/>
          </>
        }/>
        <Route path="/edit" element={
          <>
            <NavbarComponent/>
            <EditProfile user={user}/>
          </>
        }/>
        <Route path="/purchase/:carId" element={
          <>
            <NavbarComponent/>
            <CarPurchase user={user}/>
          </>
        }/>
        <Route path="/cars/:carId" element={<CarDetailPage user={user}/>}/>
         {/* 관리자 페이지 */}
       <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/admin/car/car_register" element={<CarRegisterPage/>}/>
        <Route path="/admin/car/list" element={<AdminCarListPage/>} />
      </Route>
      </Routes>
    </div>
  );
}

export default App;
