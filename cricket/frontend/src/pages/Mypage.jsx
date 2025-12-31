import React, {useState, useEffect, useCallback, useRef} from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import apiClient from '../api/axios';
import './Mypage.css';
import {useNavigate} from "react-router-dom";

function Mypage({user}) {
  const navigate = useNavigate();
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseCars, setPurchaseCars] = useState([]);
  const [recentCars, setRecentCars] = useState([]);

  const recentSectionRef = useRef(null);
  const favoriteSectionRef = useRef(null);

  console.log(favoriteCars);
  console.log(user);

  const fetchFavoriteCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/favorites?userNo=${user.no}`);

      setFavoriteCars(response.data);
    } catch (e) {
      console.error("Error fetching favorite car data:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPurchaseCars = useCallback(async () => {
    setLoading(true);

    try {
      const response = await apiClient.get(`/api/mypage-purchase?userNo=${user.no}`);

      setPurchaseCars(response.data);
      console.log(response.data);
    } catch (e) {
      console.error("Error fetching purchase cars data:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavoriteCars();
  }, [fetchFavoriteCars]);

  useEffect(() => {
    fetchPurchaseCars();
  }, [fetchPurchaseCars]);

  useEffect(() => {
    if (purchaseCars.length > 0) {
      console.log("업데이트된 구매 차량 데이터:", purchaseCars);
    }
  }, [purchaseCars]); // purchaseCars가 변경될 때마다 실행됨

  useEffect(() => {
    // 컴포넌트 마운트 시 로컬스토리지에서 읽어옴
    const saved = JSON.parse(localStorage.getItem("recentCars")) || [];
    setRecentCars(saved);
  }, []);

  const handleRemoveFavorite = async (carId) => {
    if (!window.confirm("찜 목록에서 삭제하시겠습니까?")) {
      return;
    }
    try {
      await apiClient.delete(`/api/favorites/${carId}?userNo=${user.no}`);
      // 삭제 후 목록을 다시 불러옵니다.
      fetchFavoriteCars();
    } catch (e) {
      console.error("Error removing favorite:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleScrollToRecent = () => {
    recentSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleScrollToFavorite = () => {
    favoriteSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="mypage-wrapper">
      <Container>

        {/* 상단 프로필 카드 */}
        <Card className="profile-summary-card">
          <Card.Body>
            <Row>
              <Col md={3} className="text-center">
                <div className="profile-name">{user.name}님</div>
                <div className="profile-edit" onClick={() => {
                  navigate('/edit');
                }}>정보 수정</div>
              </Col>
              <Col md={9}>
                <Row className="summary-boxes">
                  <Col className="summary-item" style={{cursor: "pointer"}} onClick={handleScrollToFavorite}>
                    <div className="label">찜한차량</div>
                    <div className="value">{loading ? '...' : favoriteCars.length}</div>
                  </Col>
                  <Col className="summary-item" style={{cursor: "pointer"}} onClick={handleScrollToRecent}>
                    <div className="label">최근본차량</div>
                    <div className="value">{recentCars.length}</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 찜한 차량 목록 */}
        <div className="section mt-4" ref={favoriteSectionRef}>
          <div className="section-header">
            <h4>찜한 차량 목록</h4>
            <span className="view-more"></span>
          </div>
          {loading && <p>찜한 차량을 불러오는 중...</p>}
          {error && <p>오류가 발생했습니다.</p>}
          {!loading && !error && (
            <Row>
              {favoriteCars.length > 0 ? (
                favoriteCars.map((car) => (
                  <Col md={4} className="mb-4" key={car.carId}>
                    <div onClick={() => navigate(`/cars/${car.carId}`)} style={{ cursor: 'pointer' }}>
                      <Card>
                        <Card.Img variant="top" src={car.carImages?.[0]?.carImageId} className="car-card-image" />
                        <Card.Body>
                          <Card.Title>{car.carBrands.brandName} {car.carModels.modelName}</Card.Title>
                          <Card.Text>
                            {car.carYear} 년식 | {car.carMileage} km | {car.carPrice} 만원
                          </Card.Text>
                          <Button variant="danger" onClick={(e) => {
                            e.stopPropagation();

                            handleRemoveFavorite(car.carId);
                          }}>찜 취소</Button>
                        </Card.Body>
                      </Card>
                    </div>

                  </Col>
                ))
              ) : (
                <Col>
                  <Card>
                    <Card.Body>
                      <div className="empty-text">찜한 차량이 없습니다.</div>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          )}
        </div>

        {/* 최근 본 차량 리스트 */}
        <div className="section mt-4" ref={recentSectionRef}>
          <div className="section-header">
            <h4>최근 본 차량 리스트</h4>
          </div>
          <Row>
            {recentCars.length > 0 ? (
              recentCars.map((car) => (
                <Col md={2} sm={4} xs={6} className="mb-4" key={car.carId}>
                  <div
                    onClick={() => navigate(`/cars/${car.carId}`)}
                    style={{ cursor: 'pointer' }}
                    className="recent-car-item"
                  >
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Img
                        variant="top"
                        src={car.image || "https://via.placeholder.com/150"}
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                      <Card.Body className="p-2">
                        <div className="fw-bold small text-truncate">
                          {car.brandName}
                        </div>
                        <div className="text-secondary x-small text-truncate">
                          {car.modelName}
                        </div>
                        <div className="fw-bold small mt-1">
                          {Number(car.carPrice).toLocaleString()} 만원
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-5">
                    <div className="empty-text text-center text-muted">최근에 구경한 차량이 없습니다.</div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </div>

        {/* 내차사기 주문관리 */}
        <div className="section mt-4 mb-5">
          <div className="section-header">
            <h4>내차사기 주문관리</h4>
          </div>
          <Card className="order-management-card">
            <Card.Body>
              {loading && <div className="text-center py-3">구매 차량을 불러오는 중...</div>}
              {error && <div className="text-center py-3 text-danger">오류가 발생했습니다.</div>}

              {!loading && !error && (
                <>
                  {purchaseCars.length > 0 ? (
                    purchaseCars.map((car, index) => (
                      <div
                        key={car.carId || index}
                        className={`d-flex align-items-center py-3 ${index !== purchaseCars.length - 1 ? 'border-bottom' : ''}`}
                        onClick={() => navigate(`/cars/${car.carId}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* 1. 차량 이미지 (썸네일) */}
                        <div className="flex-shrink-0">
                          <img
                            src={car.carImages?.carImageId || "https://via.placeholder.com/150"}
                            alt="car thumbnail"
                            className="rounded"
                            style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                          />
                        </div>

                        {/* 2. 차량 정보 */}
                        <div className="flex-grow-1 ms-3">
                          <h5 className="mb-1 fs-6 fw-bold">
                            {car.cars[index].carBrands.brandName} {car.cars[index].carModels.modelName}
                          </h5>
                          <div className="text-muted small mb-1">
                            {car.cars[index].carYear}년식 | {Number(car.cars[index].carMileage).toLocaleString()} km
                          </div>
                          {/* (선택사항) 주문 날짜가 있다면 여기에 추가 */}
                          <div className="text-secondary x-small">주문일: {car.saleDate}</div>
                        </div>

                        {/* 3. 가격 및 상태 버튼 */}
                        <div className="text-end ms-3" style={{ minWidth: '100px' }}>
                          <div className="fw-bold mb-1">
                            {Number(car.cars[index].carPrice).toLocaleString()} 만원
                          </div>
                          <span className="badge bg-success">구매 완료</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    // 데이터가 없을 때 표시
                    <div className="empty-text text-center py-5 text-muted">
                      현재 진행중인 구매 내역이 없습니다.
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Mypage;