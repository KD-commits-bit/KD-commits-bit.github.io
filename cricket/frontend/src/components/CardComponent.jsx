import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";

function CardComponent({ car }) {
  const navigate = useNavigate();
  const images = useMemo(() => car?.carImages || [], [car]);

  const mainImageUrl =
    images.find((img) => img.isPrimary === "Y")?.carImageId ||
    images[0]?.carImageId ||
    "https://via.placeholder.com/300x180?text=No+Image";

  const handleDetailClick = () => {
    navigate(`/cars/${car.carId}`);
  };

  return (
    /* 1. 카드의 높이를 100%로 고정하고 Flex 컬럼 레이아웃 적용 */
    <Card className="h-100 shadow-sm border-0" style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
      <Card.Img
        variant="top"
        src={mainImageUrl}
        alt={car.carModels?.modelName || "Car Image"}
        style={{ height: '180px', objectFit: 'cover' }}
      />

      {/* 2. Card.Body가 남은 공간을 모두 차지하도록 flex-grow 설정 */}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-6 text-truncate">
          {car.carBrands?.brandName} {car.carModels?.modelName}
        </Card.Title>

        {/* 3. 설명 부분에 일정한 높이를 주거나 줄 수 제한(Line Clamp) 적용 */}
        <Card.Text className="text-muted small mb-3" style={{
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '40px' // 설명이 짧아도 최소 높이 유지
        }}>
          <div className="text-truncate-2">{car.carDescription || '상세 설명이 없습니다.'}</div>
        </Card.Text>

        <div className="mt-auto">
          <div className="mb-2">
            <span className="fw-bold text-primary fs-5">{Number(car.carPrice).toLocaleString()}</span>
            <span className="small text-secondary"> 만원</span>
          </div>
          <div className="small text-secondary mb-3">
            {car.carYear}년식 | {Number(car.carMileage).toLocaleString()} km
          </div>
          <Button variant="outline-primary" className="w-100 rounded-pill" onClick={handleDetailClick}>
            상세보기
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;