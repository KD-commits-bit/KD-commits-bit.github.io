// src/pages/CarDetailPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import NavbarComponent from "../components/NavbarComponent.jsx";
import "../css/CarDetailPage.css";
import {useNavigate, useParams} from "react-router-dom";
import apiClient from "../api/axios.js";
import axios from "axios";

function CarDetailPage({ user }) {
  const { carId } = useParams();

  const [car, setCar] = useState(null);
  const [option, setOption] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ 현재 메인으로 보여줄 이미지 URL
  const [activeImageUrl, setActiveImageUrl] = useState("");

  const navigate = useNavigate();

  const formatNumber = (value) => {
    if (!value && value !== 0) return "-";
    const num = Number(value);
    return Number.isNaN(num) ? value : num.toLocaleString();
  };

  // ✅ images 배열(없으면 빈 배열)
  const images = useMemo(() => car?.carImages || [], [car]);

  // ✅ 대표 이미지: isPrimary === 'Y' 우선, 없으면 첫 번째
  const primaryImage = useMemo(() => {
    return images.find((img) => img.isPrimary === "Y") || images[0] || null;
  }, [images]);

  const CONDITION_LABEL = {
  1: "최상",
  2: "우수",
  3: "양호",
  4: "보통",
};

const getConditionLabel = (condition) =>
  CONDITION_LABEL [Number(condition)] || "정보없음";

  useEffect(() => {
    setLoading(true);
    setError(null);

    const carReq = axios.get(`http://localhost:8080/api/car/car_view/${carId}`);
    const optionReq = axios.get(
      `http://localhost:8080/api/car/car_view/option/${carId}`
    );

    // ✅ user가 없으면 체크 요청은 스킵
    const favoriteCheckReq = user?.no
      ? axios.get(
          `http://localhost:8080/api/favorites/check?userNo=${user.no}&carId=${carId}`
        )
      : Promise.resolve({ data: false });

    Promise.all([carReq, optionReq, favoriteCheckReq])
      .then(([carRes, optionRes, favRes]) => {
        setCar(carRes.data);
        setOption(optionRes.data);
        setIsFavorite(!!favRes.data);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [carId, user?.no]);

  // ✅ car / images가 바뀌면 대표 이미지로 active 세팅
  useEffect(() => {
    setActiveImageUrl(primaryImage?.carImageId || "");
  }, [primaryImage]);

  const handleFavorite = async (e) => {
    e.preventDefault();

    if (!user?.no) {
      alert("로그인이 필요합니다.");
      navigate('/login');

      return;
    }

    try {
      const payload = { carId: car?.carId, userNo: user.no };

      await apiClient.post("http://localhost:8080/api/favorites", payload);

      alert("찜목록에 추가되었습니다.");
      setIsFavorite(true);
    } catch (e2) {
      if (e2.response?.data?.error === "ALREADY_FAVORITE") {
        alert("이미 찜한 차량입니다!");
        setIsFavorite(true);
      } else {
        alert("찜목록 추가를 실패했습니다. 나중에 다시 시도해주세요.");
      }
    }
  };

  const handlePurchase = () => {

    if (!user?.no) {
      alert("로그인이 필요합니다.");
      navigate('/login');

      return;
    }

    navigate(`/purchase/${car.carId}`);
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!car) return <div>차량 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <NavbarComponent />

      {/* KCar 처럼 회색 배경 + 가운데 카드 */}
      <div className="detail-page" style={{ padding: "40px" }}>
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

          {/* 1. 상단 이미지 영역 */}
          <div className="detail-hero">
            <div className="hero-image-wrap">
              {activeImageUrl ? (
                <img src={activeImageUrl} alt="car" />
              ) : (
                <div style={{ padding: 20 }}>이미지 없음</div>
              )}
            </div>

            {/* ✅ 썸네일 영역 */}
            <div className="hero-thumb-row">
              {images.map((img) => (
                <img
                  key={img.carImageId}
                  src={img.carImageId} // ✅ carImageId == URL
                  alt="thumb"
                  className={`thumb ${
                    activeImageUrl === img.carImageId ? "active" : ""
                  }`}
                  onClick={() => setActiveImageUrl(img.carImageId)}
                  style={{
                    width: 90,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                    marginRight: 8,
                    border:
                      activeImageUrl === img.carImageId
                        ? "2px solid #000"
                        : "1px solid #ddd",
                  }}
                />
              ))}
            </div>
          </div>

          {/* 2. 중간 영역: 왼쪽 정보 / 오른쪽 가격 박스 */}
          <div className="detail-main-grid">
            {/* 왼쪽: 차량 요약 + 기본 정보 + 설명 */}
            <div className="detail-main-left">
              {/* 차량 요약 카드 */}
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
                      <td>{getConditionLabel(car.carCondition)}</td>
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
                  <button className="option-help-btn" type="button">
                    꼭! 알아두세요 <span className="option-help-icon">ⓘ</span>
                  </button>
                </div>

                <div className="option-box">
                  {(!option || option.length === 0) && (
                    <div className="option-row">
                      <span className="option-name">
                        등록된 선택 옵션이 없습니다.
                      </span>
                    </div>
                  )}

                  {option &&
                    option.map((opt) => (
                      <div className="option-row" key={opt.OPTION_ID}>
                        <span className="option-name">{opt.OPTION_NAME}</span>
                        <span className="option-price">
                          {opt.OPTION_CATEGORY}
                        </span>
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

                    <button
                      className={`wish-btn ${isFavorite ? "active" : ""}`}
                      onClick={handleFavorite}
                      type="button"
                    >
                      <span className="wish-icon">♡</span>
                      <span className="wish-text">
                        {isFavorite ? "찜됨" : "찜하기"}
                      </span>
                    </button>
                  </div>
                  <p className="side-price-sub">(차량가, 등록비용 포함 예시 영역)</p>
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

                <button className="btn-main-red" type="button" onClick={() => handlePurchase()}>
                  홈서비스 바로구매
                </button>
                <button className="btn-main-outline" type="button">
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
