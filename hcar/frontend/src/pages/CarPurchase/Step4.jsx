import React from 'react';
import { Card, Button, Table } from "react-bootstrap";

function Step4({ user, orderData, purchaseCar }) {

  // 결제 수단 한글 변환
  const getPayMethodLabel = (method) => {
    if (method === 'CASH') return '계좌이체 (무통장)';
    if (method === 'CARD') return '신용/체크카드';
    return method;
  };

  return (
    <div className="step-content">
      <h4 className="fw-bold mb-4">최종 주문 내용을 확인해 주세요</h4>

      {/* 1. 배송 및 주문자 정보 요약 */}
      <Card className="p-4 mb-4 border-0 shadow-sm">
        <h5 className="fw-bold mb-3 border-bottom pb-2">배송 정보</h5>
        <Table borderless size="sm" className="mb-0">
          <tbody>
          <tr>
            <td className="text-muted" style={{ width: '120px' }}>수령인</td>
            <td className="fw-bold">{orderData.recipientName}</td>
          </tr>
          <tr>
            <td className="text-muted">연락처</td>
            <td>{orderData.recipientPhone}</td>
          </tr>
          <tr>
            <td className="text-muted">배송지</td>
            <td>
              [{orderData.zipcode}] <br />
              {orderData.addressLine1} {orderData.addressLine2}
            </td>
          </tr>
          </tbody>
        </Table>
      </Card>

      {/* 2. 결제 정보 요약 */}
      <Card className="p-4 mb-4 border-0 shadow-sm bg-light">
        <h5 className="fw-bold mb-3 border-bottom pb-2">결제 정보</h5>
        <div className="d-flex justify-content-between mb-2">
          <span>결제 수단</span>
          <span className="fw-bold text-primary">{getPayMethodLabel(orderData.paymentMethod)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>차량 가격</span>
          <span>{orderData.salePrice?.toLocaleString()} 만원</span>
        </div>
        <div className="d-flex justify-content-between mb-2 text-success">
          <span>배송비</span>
          <span>무료</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center fw-bold text-danger fs-4">
          <span>최종 결제 금액</span>
          <span>{orderData.salePrice?.toLocaleString()} 만원</span>
        </div>
      </Card>

      <div className="p-3 rounded border" style={{ backgroundColor: '#fdfcfe' }}>
        <p className="small text-muted mb-0">
          위 내용을 확인하였으며, 결제 진행에 동의합니다. <br />
          (결제하기 버튼을 누르면 안전한 결제를 위해 결제창으로 이동합니다.)
        </p>
      </div>
    </div>
  );
}

export default Step4;