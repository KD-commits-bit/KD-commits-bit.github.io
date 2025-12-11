import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import apiClient from '../api/axios';
import './Mypage.css';
import {useNavigate} from "react-router-dom";

function Mypage({user}) {
  const navigate = useNavigate();
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoriteCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/favorites");
      setFavoriteCars(response.data);
    } catch (e) {
      console.error("Error fetching favorite car data:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavoriteCars();
  }, [fetchFavoriteCars]);

  const handleRemoveFavorite = async (carId) => {
    if (!window.confirm("찜 목록에서 삭제하시겠습니까?")) {
      return;
    }
    try {
      await apiClient.delete(`/api/favorites/${carId}`);
      // 삭제 후 목록을 다시 불러옵니다.
      fetchFavoriteCars();
    } catch (e) {
      console.error("Error removing favorite:", e);
      alert("삭제에 실패했습니다.");
    }
  };

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
                  <Col className="summary-item">
                    <div className="label">찜한차량</div>
                    <div className="value">{loading ? '...' : favoriteCars.length}</div>
                  </Col>
                  <Col className="summary-item">
                    <div className="label">최근본차량</div>
                    <div className="value">0</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 찜한 차량 목록 */}
        <div className="section mt-4">
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
                    <Card>
                      {/* carImages가 있고, 내용이 있을 때만 첫 번째 이미지를 보여줍니다. */}
                      <Card.Img variant="top" src={car.carImages && car.carImages.length > 0 ? car.carImages[0].carImageContent : 'https://via.placeholder.com/300x200'} />
                      <Card.Body>
                        <Card.Title>{car.carBrands.brandName} {car.carModels.modelName}</Card.Title>
                        <Card.Text>
                          {car.carYear} | {car.carMileage}km | {car.carPrice / 10000}만원
                        </Card.Text>
                        <Button variant="danger" onClick={() => handleRemoveFavorite(car.carId)}>찜 취소</Button>
                      </Card.Body>
                    </Card>
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

        {/* 채팅 리스트 */}
        <div className="section mt-4">
          <div className="section-header">
            <h4>채팅 리스트</h4>
            <span className="view-more">더보기 &gt;</span>
          </div>
          <Card>
            <Card.Body>
              <div className="empty-text">데이터 없음</div>
            </Card.Body>
          </Card>
        </div>

        {/* 내차사기 주문관리 */}
        <div className="section mt-4 mb-5">
          <div className="section-header">
            <h4>내차사기 주문관리</h4>
            <span className="view-more">더보기 &gt;</span>
          </div>
          <Card>
            <Card.Body>
              <div className="empty-text">현재 진행중인 건이 없습니다.</div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Mypage;