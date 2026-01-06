import React, {useState, useEffect, useCallback, useRef} from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import apiClient from '../api/axios';
import './Mypage.css';
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

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
    const result = await Swal.fire({
      title: '찜 목록에서 삭제하시겠습니까?',
      text: "이 차량을 찜 목록에서 제외합니다.",
      icon: 'info',
      iconColor: '#0d6efd',

      showCancelButton: true,
      confirmButtonText: '삭제하기',
      cancelButtonText: '유지하기',

      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#f8f9fa',

      customClass: {
        confirmButton: 'rounded-pill px-4 py-2 fw-bold me-3',
        cancelButton: 'rounded-pill px-4 py-2 fw-bold text-dark border',
        popup: 'rounded-4 shadow-lg'
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/favorites/${carId}?userNo=${user.no}`);
        fetchFavoriteCars();
        toast.success('찜 목록에서 삭제되었습니다.', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      } catch (e) {
        toast.error('삭제에 실패했습니다.');
      }
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
            <Row className="align-items-center">
              <Col md={4} className="text-center border-end">
                <div className="profile-greeting">마이페이지</div>
                <div className="profile-name">{user.name}님</div>
                <div className="profile-edit" onClick={() => {
                  navigate('/edit');
                }}>정보 수정</div>
              </Col>
              <Col md={8}>
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
                    purchaseCars.map((order, index) => {
                      // 데이터 구조에 맞춰 변수를 미리 정의하면 코드가 깔끔해집니다.
                      const carInfo = order.cars && order.cars[0]; // order 내부의 cars 배열의 첫 번째 객체

                      if (!carInfo) return null; // 혹시라도 차량 정보가 없으면 출력 안 함

                      return (
                        <div
                          key={order.saleNo || index}
                          className={`d-flex align-items-center py-3 ${index !== purchaseCars.length - 1 ? 'border-bottom' : ''}`}
                          onClick={() => navigate(`/cars/${order.carId}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* 1. 차량 이미지 (order 객체 바로 아래의 carImages 사용) */}
                          <div className="flex-shrink-0">
                            <img
                              src={order.carImages?.carImageId || "https://via.placeholder.com/150"}
                              alt="car thumbnail"
                              className="rounded"
                              style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                            />
                          </div>

                          {/* 2. 차량 정보 */}
                          <div className="flex-grow-1 ms-3">
                            <h5 className="mb-1 fs-6 fw-bold">
                              {carInfo.carBrands?.brandName} {carInfo.carModels?.modelName}
                            </h5>
                            <div className="text-muted small mb-1">
                              {carInfo.carYear}년식 | {Number(carInfo.carMileage).toLocaleString()} km
                            </div>
                            <div className="text-secondary x-small">주문일: {order.saleDate}</div>
                          </div>

                          {/* 3. 가격 및 상태 버튼 */}
                          <div className="text-end ms-3" style={{ minWidth: '100px' }}>
                            <div className="fw-bold mb-1 text-primary">
                              {Number(carInfo.carPrice).toLocaleString()} 만원
                            </div>
                            <span className="badge bg-success">구매 완료</span>
                          </div>
                        </div>
                      );
                    })
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