
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import apiClient from "../api/axios";
import "../css/AdminCarListPage.css";
function AdminCarListPage() {


  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL"); // ALL | 0 | 1 | SOLD 등 (프로젝트 기준에 맞게)
  const [sort, setSort] = useState("NEW"); // NEW | PRICE_ASC | PRICE_DESC | MILEAGE_ASC

  useEffect(() => {
    // ✅ 관리자용 목록 API가 따로 있으면 그걸로 바꾸세요.
    // 예: /api/admin/cars or /api/car/all
    apiClient
      .get("/api/car/all")
      .then((res) => {
        setCars(res.data || []);
      })
      .catch((err) => {
        console.error("차량 목록 조회 실패", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const normalized = (v) => (v ?? "").toString().toLowerCase();

  const filtered = useMemo(() => {
    let list = [...cars];

    // 검색(모델명/브랜드명/차량ID 등)
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      list = list.filter((c) => {
        const carId = normalized(c.carId);
        const modelName = normalized(c?.carModels?.modelName);
        const brandName = normalized(c?.carBrands?.brandName);
        const year = normalized(c.carYear);
        return (
          carId.includes(k) ||
          modelName.includes(k) ||
          brandName.includes(k) ||
          year.includes(k)
        );
      });
    }

    // 상태 필터
    if (status !== "ALL") {
      list = list.filter((c) => String(c.carStatus) === String(status));
    }

    // 정렬
    const toNum = (x) => {
      const n = Number(String(x ?? "").replace(/,/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    if (sort === "NEW") {
      // createdAt이 문자열이므로 안전하게 문자열 비교(ISO면 OK). 없으면 carId 기준 대체
      list.sort((a, b) => (String(b.carCreatedAt ?? b.carId)).localeCompare(String(a.carCreatedAt ?? a.carId)));
    } else if (sort === "PRICE_ASC") {
      list.sort((a, b) => toNum(a.carPrice) - toNum(b.carPrice));
    } else if (sort === "PRICE_DESC") {
      list.sort((a, b) => toNum(b.carPrice) - toNum(a.carPrice));
    } else if (sort === "MILEAGE_ASC") {
      list.sort((a, b) => toNum(a.carMileage) - toNum(b.carMileage));
    }

    return list;
  }, [cars, keyword, status, sort]);

  const badgeText = (carStatus) => {
    // 프로젝트에서 쓰는 상태값에 맞게 바꾸세요 (예: 1=판매중, 2=예약중, 3=판매완료)
    if (String(carStatus) === "1") return "판매중";
    if (String(carStatus) === "2") return "예약중";
    if (String(carStatus) === "3") return "판매완료";
    return `상태:${carStatus ?? "-"}`;
  };

  const badgeClass = (carStatus) => {
    if (String(carStatus) === "1") return "badge active";
    if (String(carStatus) === "2") return "badge pending";
    if (String(carStatus) === "3") return "badge sold";
    return "badge";
  };

  return (
    <div style={{ padding: "90px" }}>
      <NavbarComponent />

      <main className="admincar-wrap">
        <header className="admincar-hero">
          <div>
            <h1 className="admincar-title">차량 목록</h1>
            <p className="admincar-subtitle">등록된 차량을 조회/검색하고 상세 페이지로 이동할 수 있습니다.</p>
          </div>

          <div className="admincar-hero-actions">
            <button
              className="admincar-btn primary"
              onClick={() => navigate("/admin/car/car_register")}
            >
              + 차량 등록
            </button>
            <button className="admincar-btn" onClick={() => navigate("/admin")}>
              대시보드
            </button>
          </div>
        </header>

        {/* 필터 바 */}
        <section className="admincar-filters">
          <div className="filter-item">
            <label className="filter-label">검색</label>
            <input
              className="filter-input"
              placeholder="차량ID, 브랜드, 모델명, 연식 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label className="filter-label">상태</label>
            <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">전체</option>
              <option value="1">판매중</option>
              <option value="2">예약중</option>
              <option value="3">판매완료</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">정렬</label>
            <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="NEW">최신 등록순</option>
              <option value="PRICE_ASC">가격 낮은순</option>
              <option value="PRICE_DESC">가격 높은순</option>
              <option value="MILEAGE_ASC">주행거리 적은순</option>
            </select>
          </div>

          <div className="filter-summary">
            <div className="summary-pill">
              총 <strong>{filtered.length.toLocaleString()}</strong> 대
            </div>
          </div>
        </section>

        {/* 리스트 */}
        <section className="admincar-table-card">
          {loading ? (
            <div className="admincar-empty">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="admincar-empty">조건에 맞는 차량이 없습니다.</div>
          ) : (
            <table className="admincar-table">
              <thead>
                <tr>
                  <th>차량ID</th>
                  <th>브랜드</th>
                  <th>모델</th>
                  <th>연식</th>
                  <th>주행거리</th>
                  <th>가격</th>
                  <th>상태</th>
                  <th style={{ width: 160 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.carId}>
                    <td className="mono">{c.carId}</td>
                    <td>{c?.carBrands?.brandName ?? "-"}</td>
                    <td>{c?.carModels?.modelName ?? "-"}</td>
                    <td>{c.carYear ?? "-"}</td>
                    <td>{(c.carMileage ?? "-").toString()}</td>
                    <td>{(c.carPrice ?? "-").toString()}</td>
                    <td>
                      <span className={badgeClass(c.carStatus)}>{badgeText(c.carStatus)}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-btn"
                          onClick={() => navigate(`/cars/${c.carId}`)}
                        >
                          상세보기
                        </button>
                        <button
                          className="row-btn ghost"
                          onClick={() => alert("수정 기능은 다음 단계에서 연결하면 됩니다.")}
                        >
                          수정
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

export default AdminCarListPage