import React, {useEffect} from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from "react-bootstrap";

function Step2({ user, purchaseCar, primaryImage, orderData, setOrderData }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePostCode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 주소 선택 시 부모의 orderData 상태 업데이트
        setOrderData({
          ...orderData,
          zipcode: data.zonecode,
          addressLine1: data.address,
          addressLine2: "" // 상세주소는 초기화
        });
      },
    }).open();
  };

  return (
    <div className="step-content">
      <h4 className="fw-bold mb-4">배송지 정보를 확인해 주세요</h4>

      {/* 1. 차량 요약 (심플하게) */}
      <Card className="mb-4 border-0 bg-light">
        <Card.Body className="d-flex align-items-center">
          <img src={primaryImage} alt="car" style={{ width: "100px", borderRadius: "8px" }} />
          <div className="ms-3">
            <div className="fw-bold">{purchaseCar.carDescription}</div>
            <div className="text-muted small"><b>{purchaseCar.carPrice?.toLocaleString()}</b> 만원</div>
          </div>
        </Card.Body>
      </Card>

      {/* 2. 배송지 입력 폼 (SALES 테이블 컬럼 매핑) */}
      <Card className="p-4 shadow-sm border-0">
        <h5 className="fw-bold mb-3">수령인 정보</h5>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="small text-muted">수령인 성함</Form.Label>
              <Form.Control
                type="text"
                value={orderData.recipientName}
                required
                onChange={(e) => setOrderData({...orderData, recipientName: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="small text-muted">수령인 연락처</Form.Label>
              <Form.Control
                type="text"
                value={orderData.recipientPhone}
                required
                onChange={(e) => setOrderData({...orderData, recipientPhone: e.target.value})}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr className="my-3"/>

        <h5 className="fw-bold mb-3">배송지 주소</h5>
        <Form.Group className="mb-3">
          <Form.Label className="small text-muted">우편번호</Form.Label>
          <InputGroup className="mb-2" style={{maxWidth: '300px'}}>
            <Form.Control value={orderData.zipcode} readOnly required />
            <Button variant="outline-dark" onClick={handlePostCode}>주소 찾기</Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="small text-muted">기본 주소</Form.Label>
          <Form.Control value={orderData.addressLine1} readOnly required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="small text-muted">상세 주소</Form.Label>
          <Form.Control
            type="text"
            value={orderData.addressLine2}
            placeholder="동, 호수 등 상세 주소를 입력하세요"
            required
            onChange={(e) => setOrderData({...orderData, addressLine2: e.target.value})}
          />
        </Form.Group>
      </Card>

      <div className="mt-4 p-3 rounded" style={{backgroundColor: '#fff5f5', color: '#c40000', fontSize: '13px'}}>
        • 입력하신 주소로 차량이 탁송됩니다. 주소가 정확한지 다시 한번 확인해 주세요.
      </div>
    </div>
  );
}

export default Step2;