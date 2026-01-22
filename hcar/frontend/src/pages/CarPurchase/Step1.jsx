import React from 'react';

function Step1({user, purchaseCar, primaryImage}) {
  if (!purchaseCar) return <div style={{ padding: "100px" }}>로딩중...</div>;

  return (
    <div className="step-content">
      <h4 className="mb-3">{user.name} 고객님, 안녕하세요.</h4>
      <p className="description">
        지금부터 홈서비스 바로구매를 시작하겠습니다.<br/>
        먼저, 차량 정보와 예상 결제 금액을 확인해 주세요.
      </p>

      <img
        src={primaryImage}
        alt="car"
        className="car-preview"
      />
      <p className="text-muted small">
        • 배송비는 배송 지역에 따라 다릅니다. 정확한 배송비는 결제 단계에서 확인하실 수 있으며, 예상 결제 금액에는 포함되지 않습니다.<br/>
        • 이전등록비 감면 혜택 선택은 결제 후 추가정보 입력 할 때 선택할 수 있습니다.
      </p>
    </div>
  );
}

export default Step1;