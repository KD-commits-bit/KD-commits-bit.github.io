import React from "react";
import NavbarComponent from "../components/NavbarComponent";
import "../css/AdminPage.css"

function AdminPage() {
   return (
    <>
      <NavbarComponent />

      <div className="admin-container">
        <h1 className="admin-title">관리자 페이지</h1>
        <p className="admin-subtitle">
          
        </p>

        {/* 대시보드 영역 */}
        <div className="admin-dashboard">
          <div className="admin-card">
            <h3>등록된 차량 수</h3>
            <p className="admin-number">—</p>
          </div>

          <div className="admin-card">
            <h3>총 구매 건수</h3>
            <p className="admin-number">—</p>
          </div>

          <div className="admin-card">
            <h3>오늘 신규 가입자</h3>
            <p className="admin-number">—</p>
          </div>
        </div>

        {/* 기능 섹션 */}
        <div className="admin-section">
          <h2>관리 기능</h2>

          <div className="admin-buttons">
            <button className="admin-btn">차량 등록하기</button>
            <button className="admin-btn">차량 목록 보기</button>
            <button className="admin-btn">구매 내역 확인</button>
            <button className="admin-btn">회원 관리</button>
          </div>
        </div>
      </div>
    </>
  );
}



export default AdminPage