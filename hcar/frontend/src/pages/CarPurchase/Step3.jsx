import React, { useEffect, useState } from 'react';
import { Card, Row, Col, InputGroup, Form, Button, Modal, Table } from "react-bootstrap";

function Step3({ user, orderData, setOrderData, purchaseCar }) {
  // 상태 관리
  const [isInstallment, setIsInstallment] = useState(false);
  const [months, setMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(5.9);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [showBenefitModal, setShowBenefitModal] = useState(false); // 팝업 상태

  // 할부 계산 로직
  useEffect(() => {
    if (orderData.paymentMethod === 'CARD' && isInstallment) {
      const P = purchaseCar.carPrice;
      const r = (interestRate / 100) / 12;
      const n = months;

      if (r === 0) {
        setMonthlyPayment(Math.floor(P / n));
      } else {
        const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setMonthlyPayment(Math.floor(payment));
      }
    }
  }, [months, interestRate, purchaseCar.carPrice, orderData.paymentMethod, isInstallment]);

  return (
    <div className="step-content">
      <h4 className="fw-bold mb-4">결제 방식을 선택하세요</h4>

      {/* 1. 메인 결제 수단 선택 */}
      <Row className="g-3 mb-4">
        {[
          { id: 'CASH', name: '계좌이체(현금)', icon: '💰' },
          { id: 'CARD', name: '신용/체크카드', icon: '💳' },
        ].map((method) => (
          <Col key={method.id} xs={6}>
            <Card
              className={`p-3 text-center cursor-pointer border-2 ${orderData.paymentMethod === method.id ? 'border-danger bg-light' : ''}`}
              onClick={() => {
                setOrderData({ ...orderData, paymentMethod: method.id });
                if (method.id === 'CASH') setIsInstallment(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontSize: '24px' }}>{method.icon}</div>
              <div className="fw-bold">{method.name}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 2. 카드 결제 하위 옵션 */}
      {orderData.paymentMethod === 'CARD' && (
        <Card className="p-4 mb-4 border-0 shadow-sm border-start border-danger border-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h6 className="fw-bold mb-0">결제 옵션</h6>
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ fontSize: '11px' }}
              onClick={() => setShowBenefitModal(true)}
            >
              카드사별 무이자 혜택 보기 🔍
            </Button>
          </div>

          <div className="d-flex gap-4 mb-3">
            <Form.Check
              type="radio"
              label="일시불"
              name="cardOption"
              checked={!isInstallment}
              onChange={() => setIsInstallment(false)}
            />
            <Form.Check
              type="radio"
              label="카드 할부"
              name="cardOption"
              checked={isInstallment}
              onChange={() => setIsInstallment(true)}
            />
          </div>

          {isInstallment && (
            <div className="mt-3 p-3 bg-light rounded">
              <Row>
                <Col xs={6}>
                  <Form.Label className="small fw-bold">할부 기간</Form.Label>
                  <Form.Select size="sm" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
                    {[12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m}개월</option>)}
                  </Form.Select>
                </Col>
                <Col xs={6}>
                  <Form.Label className="small fw-bold">예상 이율 (%)</Form.Label>
                  <InputGroup size="sm">
                    <Form.Control type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            </div>
          )}
        </Card>
      )}

      {/* 3. 최종 금액 요약 */}
      <Card className="p-4 border-0 shadow-sm bg-white">
        <div className="d-flex justify-content-between mb-2">
          <span>차량 가격</span>
          <span className="fw-bold">{purchaseCar.carPrice?.toLocaleString()} 만원</span>
        </div>
        <div className="d-flex justify-content-between mb-2 text-success small">
          <span>배송비</span>
          <span>무료</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-secondary">최종 실결제 금액</span>
          <div className="text-end">
            {/* 할부 선택 시 월 납입금 표시 */}
            {isInstallment && orderData.paymentMethod === 'CARD' && (
              <div className="text-primary fw-bold mb-1" style={{ fontSize: '1.2rem' }}>
                월 {monthlyPayment.toLocaleString()} 만원 <span className="small">({months}개월)</span>
              </div>
            )}
            <div className={`${isInstallment ? 'text-muted small' : 'text-danger fw-bold fs-4'}`}>
              총 {purchaseCar.carPrice?.toLocaleString()} 만원
            </div>
          </div>
        </div>
      </Card>

      {/* 카드사 혜택 팝업 (더미) */}
      <Modal show={showBenefitModal} onHide={() => setShowBenefitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">카드사별 무이자 혜택 안내</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive bordered hover className="text-center small">
            <thead className="table-light">
            <tr>
              <th>카드사</th>
              <th>무이자 할부</th>
              <th>부분 무이자</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>신한카드</td>
              <td>2~6개월</td>
              <td>10, 12개월</td>
            </tr>
            <tr>
              <td>국민카드</td>
              <td>2~7개월</td>
              <td>10, 12, 18개월</td>
            </tr>
            <tr>
              <td>삼성카드</td>
              <td>2~6개월</td>
              <td>10, 12개월</td>
            </tr>
            <tr>
              <td>현대카드</td>
              <td>2~8개월</td>
              <td>-</td>
            </tr>
            </tbody>
          </Table>
          <p className="text-muted" style={{ fontSize: '11px' }}>
            * 본 혜택은 카드사 사정에 따라 변경될 수 있으며, 법인/기프트카드는 제외됩니다.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Step3;