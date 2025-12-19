import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, ProgressBar, Modal} from "react-bootstrap";
import "../css/CarPurchase.css"
import {useParams} from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Step1 from "./CarPurchase/Step1.jsx";
import Step2 from "./CarPurchase/Step2.jsx";
import Step3 from "./CarPurchase/Step3.jsx";
import Step4 from "./CarPurchase/Step4.jsx";
import Step5 from "./CarPurchase/Step5.jsx";

function CarPurchase({user}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseCar, setPurchaseCar] = useState(null);
  const [option, setOption] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  const carId = useParams();

  const [orderData, setOrderData] = useState({
    carId: carId.carId,      // 이건 상품 정보니 유지하는 게 좋습니다.
    userNo: user.no,     // 누가 주문했는지는 알아야 하니 유지하세요.
    adminNo: "",
    salePrice: 0,
    recipientName: "",       // 빈 값으로 두면 화면에 비어서 나옵니다.
    recipientPhone: "",      // 빈 값
    zipcode: "",             // 빈 값
    addressLine1: "",        // 빈 값
    addressLine2: "",        // 빈 값
    paymentMethod: "CASH"
  });

  console.log(orderData);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchPurchaseCar = async () => {
      try {
        const [carRes, optionRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/car/car_view/${carId.carId}`),
          axios.get(`http://localhost:8080/api/car/car_view/option/${carId.carId}`)
        ]);

        console.log(optionRes.data);

        setPurchaseCar(carRes.data);
        setOption(optionRes.data);
        setOrderData(prev => ({
          ...prev,
          carId: carId.carId,
          adminNo: carRes.data.adminNo,
          salePrice: carRes.data.carPrice
        }));
      } catch (e) {
        console.error("차량 조회 실패:", e);
      }
    };

    fetchPurchaseCar();
  }, [carId.carId]);

  const requestPay = () => {
    const { IMP } = window;
    IMP.init("imp31705713");

    // 실제 결제창에 띄울 금액 (테스트를 위해 100원으로 고정)
    const testAmount = 100;

    const amount = purchaseCar.carPrice * 10000;

    // 1. 사용자의 선택에 따른 PG 및 결제방식 설정
    let pgValue = "";

    if (orderData.paymentMethod === 'CARD') {
      pgValue = "html5_inicis.INIpayTest";
    } else if (orderData.paymentMethod === 'CASH') {
      pgValue = "kakaopay.TC0ONETIME";
    }

    let payMethodValue = "card"; // 기본값은 카드

    if (orderData.paymentMethod === 'CARD') {
      // 신용카드 선택 시 (일반 이니시스 등)
      pgValue = "html5_inicis";
      payMethodValue = "card";
    } else if (orderData.paymentMethod === 'CASH') {
      // 계좌이체 선택 시 (카카오페이 테스트나 이니시스 실시간 계좌이체)
      // 테스트 용도라면 kakaopay.TC0ONETIME를 사용하거나 html5_inicis의 trans 사용
      pgValue = "kakaopay.TC0ONETIME";
      payMethodValue = "kakaopay";
    }

    // 2. 결제 요청 데이터
    IMP.request_pay({
      pg: pgValue,
      pay_method: payMethodValue,
      merchant_uid: `mid_${Date.now()}`,
      name: purchaseCar.carDescription,
      amount: testAmount,
      buyer_email: user.userEmail || "test@test.com",
      buyer_name: orderData.recipientName,
      buyer_tel: orderData.recipientPhone,
      buyer_addr: `${orderData.addressLine1} ${orderData.addressLine2}`,
      buyer_postcode: orderData.zipcode,
      // 카드 결제 시 할부 개월 수 명시 (선택 사항)
      // display: { card_quota: [2, 3, 4, 5, 6] }
    }, async (rsp) => {
      if (rsp.success) {
        try {
          const res = await axios.post("http://localhost:8080/api/purchase/success", {
            ...orderData,
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
            salePrice: amount
          });

          if (res.status === 200) {
            setCurrentStep(5);
          }
        } catch (err) {
          console.error("서버 저장 상세 에러:", err.response?.data);
          alert("결제는 성공했으나 시스템 기록에 실패했습니다.");
        }
      } else {
        alert("결제 실패: " + rsp.error_msg);
      }
    });
  };

  if (!purchaseCar) {
    return <div style={{padding: "100px"}}>로딩중...</div>;
  }

  const primaryImage =
    purchaseCar?.carImages?.find(img => img.isPrimary === "Y")?.carImageId
    ?? purchaseCar?.carImages?.[0]?.carImageId
    ?? "/images/no-image.png";

  const groupedOptions = option?.reduce((acc, cur) => {
    if (!acc[cur.OPTION_CATEGORY]) {
      acc[cur.OPTION_CATEGORY] = [];
    }
    acc[cur.OPTION_CATEGORY].push(cur);
    return acc;
  }, {});

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  }

  const handlePurchaseComplete = async () => {
    try {
      // 1. 백엔드 전송용 데이터 정리 (SALES 테이블 11개 컬럼에 맞춤)
      const finalData = {
        ...orderData
      };

      // 2. 백엔드 API 호출
      const response = await axios.post("http://localhost:8080/api/purchase/success", finalData);

      if (response.status === 200) {
        alert("구매가 완료되었습니다!");
        setCurrentStep(5); // 완료 페이지로 이동
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      alert(error.response?.data || "결제 중 오류가 발생했습니다.");
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      // Step 4에서는 결제 로직 실행
      requestPay();
    } else if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (<Step1 user={user} purchaseCar={purchaseCar} primaryImage={primaryImage}/>)
      case 2:
        return (<Step2 user={user} purchaseCar={purchaseCar} primaryImage={primaryImage} orderData={orderData}
                       setOrderData={setOrderData}/>)
      case 3:
        return (<Step3 user={user} purchaseCar={purchaseCar} orderData={orderData}
                       setOrderData={setOrderData}/>)
      case 4:
        return (<Step4 user={user} purchaseCar={purchaseCar} orderData={orderData}
                       setOrderData={setOrderData}/>)
      case 5:
        return (<Step5 user={user} purchaseCar={purchaseCar} primaryImage={primaryImage} orderData={orderData}
                       setOrderData={setOrderData}/>)
      default:
        return null;
    }
  }

  return (
    <div style={{padding: '100px'}}>
      <Container className="purchase-container">
        <h3 className="purchase-title">결제를 도와드리겠습니다.</h3>
        <p className="purchase-sub">
          화면 아래에 표시된 순서에 따라 진행됩니다.
        </p>
        {/* 단계 표시 */}
        <Card className="step-card">
          <div className="step-list">
            {[
              "주문 신청",
              "주문 내역 확인",
              "결제 조건 확인",
              "결제",
              "구매완료 및 배송",
            ].map((label, idx) => (
              <div
                key={idx}
                className={`step-item ${currentStep === idx + 1 ? "active" : ""}`}
              >
                <span className="step-circle">{idx + 1}</span>
                <span className="step-label">{label}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* 메인 컨텐츠 */}
        <Row className="mt-5">
          {/* 좌측 */}
          <Col md={8}>
            {renderStepContent()}
            <br/>
            <div className="d-flex justify-content-center mt-4 align-items-center">
              {currentStep > 1 && (
                <Button className="prev-btn me-2" onClick={handlePrev}>
                  이전
                </Button>
              )}
              <Button className="next-btn" onClick={handleNext}>
                {
                  currentStep === 4 ? "결제하기" : (
                    currentStep === 5 ? "완료" : "다음"
                  )
                }
              </Button>
            </div>
          </Col>

          {/* 우측 요약 카드 */}
          <Col md={4}>
            <Card className="summary-card">
              <Card.Body>
                <h5 className="fw-bold mb-3">주문 신청</h5>
                <ProgressBar now={currentStep * 20} className="mb-2"/>
                <div className="step-count">{currentStep}/5</div>

                <hr/>

                <div className="car-summary-title">
                  {purchaseCar.carDescription}
                </div>
                <div className="car-summary-sub">
                  {purchaseCar.carYear}년식 · {purchaseCar.carMileage}km
                </div>
                <div className="summary-box-wrapper">
                  <div
                    className="summary-box"
                    onClick={() => setShowOptionModal(true)}
                  >
                    차량옵션
                  </div>

                  <div
                    className="summary-box"
                    onClick={() => setShowInspectionModal(true)}
                  >
                    성능·상태<br/>점검기록부
                  </div>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showOptionModal}
        onHide={() => setShowOptionModal(false)}
        centered
        size="lg"
        className="custom-purchase-modal"
      >
        <Modal.Header closeButton className="custom-modal-header p-4">
          <Modal.Title className="modal-title-main">
            <span className="text-danger">차량 상세</span> 옵션 정보
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {groupedOptions && Object.entries(groupedOptions).length > 0 ? (
            Object.entries(groupedOptions).map(([category, items]) => (
              <div className="option-section" key={category}>
                <div className="option-category-title">
                  {category} <span className="ms-2 text-muted fw-normal" style={{fontSize: '0.8rem'}}>{items.length}</span>
                </div>
                <div className="option-grid">
                  {items.map((opt, idx) => (
                    <div className="option-pill" key={idx}>
                      {opt.OPTION_NAME}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">등록된 옵션 정보가 없습니다.</div>
          )}
        </Modal.Body>

        <div className="modal-info-box">
          <div className="d-flex align-items-start small text-muted">
            <span className="me-2">️</span>
            <div>
              <p className="mb-1 fw-bold text-dark">꼭 확인해 주세요!</p>
              <p className="mb-1">• 옵션의 유무와 작동여부는 차량평가사가 직접 확인하여 진단하였습니다.</p>
              <p className="mb-1">• '비순정' 항목은 신차 출고 이후 장착된 부품을 의미합니다.</p>
              <p className="mb-0">• 실제 차량 상태와 미세한 차이가 있을 수 있으니 상세 사진을 참조해 주세요.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CarPurchase;