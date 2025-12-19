import React from 'react';
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Step5({ purchaseCar, primaryImage, orderData }) {
  const navigate = useNavigate();

  return (
    <div className="step-content text-center py-5">
      <div className="mb-4">
        <span style={{ fontSize: '64px' }}>🎉</span>
      </div>
      <h2 className="fw-bold mb-3">구매 신청이 완료되었습니다!</h2>
      <p className="text-muted mb-5">
        전문 상담사가 곧 연락드릴 예정입니다. <br />
        안전한 탁송을 위해 배송 준비를 시작하겠습니다.
      </p>

      <Card className="mx-auto border-0 shadow-sm mb-4" style={{ maxWidth: '450px' }}>
        <Card.Body className="d-flex align-items-center p-3">
          <img src={primaryImage} alt="car" style={{ width: '80px', borderRadius: '8px' }} />
          <div className="ms-3 text-start">
            <div className="fw-bold">{purchaseCar.carDescription}</div>
            <div className="small text-muted">최종 결제 금액: {orderData.salePrice?.toLocaleString()}원</div>
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center gap-3">
        <Button variant="outline-dark" onClick={() => navigate('/mypage/orders')}>
          주문 내역 확인
        </Button>
        <Button variant="danger" onClick={() => navigate('/')}>
          메인으로 이동
        </Button>
      </div>
    </div>
  );
}

export default Step5;