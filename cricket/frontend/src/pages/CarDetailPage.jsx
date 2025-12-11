import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent.jsx";
import "../css/CarDetailPage.css";
import { useParams } from "react-router-dom";
import axios from "axios";

function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatNumber = (value) => {
    if (!value && value !== 0) return "-";
    const num = Number(value);
    return Number.isNaN(num) ? value : num.toLocaleString();
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const carReq = axios.get(
       `http://localhost:8080/api/car/car_view/${carId}`
    )

    const optionReq = axios.get(
      `http://localhost:8080/api/car/car_view/option/${carId}`
    );


    Promise.all([carReq, optionReq])
        .then(([carRes, optionRes]) => {
            setCar(carRes.data);
            setOption(optionRes.data);

            console.log(carRes);
            console.log(optionRes);
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            setLoading(false);
        })

  }, [carId]);

    

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!car) return <div>차량 정보를 찾을 수 없습니다.</div>;

  const imageUrl = car.carImages?.carImageId;

  return (
    <>
      <NavbarComponent />

      {/* KCar 처럼 회색 배경 + 가운데 카드 */}
      <div className="detail-page">
        <div className="detail-container">

          {/* 상단 제목 */}
          <div className="detail-header">
            <h1 className="detail-title">
              {car.carBrands?.brandName} {car.carModels?.modelName}
            </h1>
            <p className="detail-subtitle">
              {car.carYear}년식 · {formatNumber(car.carMileage)} km ·{" "}
              {formatNumber(car.carPrice)} 만원
            </p>
          </div>

          {/* 1. 상단 이미지 영역  */}
          <div className="detail-hero">
            <div className="hero-image-wrap">
              <img src={imageUrl} alt="car" />
            </div>
            <div className="hero-thumb-row">
             
            </div>
          </div>

          {/* 2. 중간 영역: 왼쪽 정보 / 오른쪽 가격 박스 */}
          <div className="detail-main-grid">
            {/* 왼쪽: 차량 요약 + 기본 정보 + 설명 */}
            <div className="detail-main-left">

              {/* KCar의 차량 요약 카드 느낌 */}
              <section className="summary-card section-card">
                <h2>차량 요약 정보</h2>
                <div className="summary-row">
                  <div className="summary-item">
                    <span className="summary-label">연식</span>
                    <span className="summary-value">{car.carYear}년식</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">주행거리</span>
                    <span className="summary-value">
                      {formatNumber(car.carMileage)} km
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">모델</span>
                    <span className="summary-value">
                      {car.carModels?.modelName}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">브랜드</span>
                    <span className="summary-value">
                      {car.carBrands?.brandName}
                    </span>
                  </div>
                </div>
              </section>

              {/* 기본 정보 테이블 */}
              <section className="section-card">
                <h2>차량 기본 정보</h2>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <th>연식</th>
                      <td>{car.carYear}</td>
                    </tr>
                    <tr>
                      <th>주행거리</th>
                      <td>{formatNumber(car.carMileage)} km</td>
                    </tr>
                    <tr>
                      <th>모델명</th>
                      <td>{car.carModels?.modelName}</td>
                    </tr>
                    <tr>
                      <th>브랜드</th>
                      <td>{car.carBrands?.brandName}</td>
                    </tr>
                    <tr>
                      <th>상태</th>
                      <td>{car.carStatus}</td>
                    </tr>
                    <tr>
                      <th>등록일</th>
                      <td>{car.carCreatedAt}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* 옵션 */}
              <section className="section-card">
                <div className="option-header-row">
                    <div>
                    <span className="option-total-price">옵션</span>
                    <span className="option-title-text"> 주요 옵션</span>
                    </div>
                    <button className="option-help-btn">
                    꼭! 알아두세요 <span className="option-help-icon">ⓘ</span>
                    </button>
                </div>

                 <div className="option-box">
                   {(!option || option.length === 0) && (
                    <div className="option-row">
                        <span className = "option-name">등록된 선택 옵션이 없습니다.</span>
                    </div>
                   )}

                   {option && 
                        option.map(opt => (
                            <div className="option-row" key={opt.OPTION_ID}>
                                <span className="option-name">{opt.OPTION_NAME}</span>
                                <span className="option-price">{opt.OPTION_CATEGORY}</span>
                            </div>
                        ))}
                </div>
              </section>
            </div>

            {/* 오른쪽: 가격/비용/버튼 (sticky 카드) */}
            <aside className="detail-main-right">
              <div className="side-price-card">
                <div className="side-price-top">
                  <span className="side-price-label">총 구매비용</span>
                  <div className="side-price-main">
                    <span className="side-price-number">
                      {formatNumber(car.carPrice)}
                    </span>
                    <span className="side-price-unit">만원</span>
                  </div>
                  <p className="side-price-sub">
                    (차량가, 등록비용 포함 예시 영역)
                  </p>
                </div>

                <ul className="side-price-list">
                  <li>
                    <span>차량가</span>
                    <span>{formatNumber(car.carPrice)} 만원</span>
                  </li>
                  <li>
                    <span>등록비용</span>
                    <span>-</span>
                  </li>
                  <li>
                    <span>기타비용</span>
                    <span>-</span>
                  </li>
                </ul>

                <button className="btn-main-red">홈서비스 바로구매</button>
                <button className="btn-main-outline">
                  방문 예약하기
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarDetailPage;
