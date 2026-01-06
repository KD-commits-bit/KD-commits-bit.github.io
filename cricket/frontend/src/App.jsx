import "./App.css";
import CardComponent from "./components/CardComponent.jsx";
import NavbarComponent from "./components/NavbarComponent.jsx";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CarouselComponent from "./components/CarouselComponent.jsx";
import axios from "axios";
import {useState, useEffect, useRef} from "react";
import Mypage from "./pages/Mypage.jsx";
import CarDetailPage from "./pages/CarDetailPage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import {useAuth} from "./hooks/useAuth.js";
import AdminPage from "./pages/AdminPage.jsx";
import CarRegisterPage from "./pages/CarRegisterPage.jsx";
import ProtectedRoute  from "./routes/ProtectedRoute.jsx";
import CarPurchase from "./pages/CarPurchase.jsx";
import SearchSection from "./components/SearchSection.jsx";
import "./App.css"
import {Button, Col, Container, Row} from "react-bootstrap";
import AdminCarListPage from "./pages/AdminCarListPage.jsx";



function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();

  const searchSectionRef = useRef(null);
  const resultSectionRef = useRef(null);

  const fetchAllCars = (showLoadingScreen = true) => {
    if (showLoadingScreen) {
      setLoading(true);
    }

    axios.get("/api/car/all")
      .then((response) => {
        setCars(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching car data:", e);
        setError(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllCars(true);
  }, []);

  const handleShowAll = () => {
    fetchAllCars(false);
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleScrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
            <NavbarComponent onSearchClick={handleScrollToSearch}/>
            <header className="App-header" style={{textAlign: "center", paddingTop: '80px', marginBottom: "50px"}}>
              <CarouselComponent onScrollDown={handleScrollToSearch}/>
            </header>

            <SearchSection ref={searchSectionRef} setCars={setCars} resultSectionRef={resultSectionRef}/>

            <section ref={resultSectionRef} style={{ padding: "100px 0", backgroundColor: "#fcfcfc" }}>
              <Container>
                <div className="d-flex justify-content-between align-items-end mb-5">
                  <div>
                    <h3 className="fw-bold mb-1">지금 바로 구매 가능한 차량</h3>
                    <p className="text-muted">엄격한 기준을 통과한 무사고 차량들입니다.</p>
                  </div>
                  <Button variant="outline-secondary" className="rounded-pill px-4" onClick={handleShowAll}>전체차량보기</Button>
                </div>

                <Row className="g-4">
                  {cars.length > 0 ? (
                    cars.map((car) => (
                      <Col key={car.carId} lg={3} md={4} sm={6} className="d-flex">
                        <CardComponent car={car}/>
                      </Col>
                    ))
                  ) : (
                    <Col className="text-center py-5">
                      <p className="text-muted">검색 조건에 맞는 차량이 없습니다.</p>
                    </Col>
                  )}
                </Row>
              </Container>
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