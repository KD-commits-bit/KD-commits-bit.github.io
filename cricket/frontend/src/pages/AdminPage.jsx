import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import "../css/AdminPage.css";



function StatCard({ icon, title, value, delta }) {
  return (
    <div className="admin-card">
      <div className="card-top">
        <div className="card-icon" aria-hidden>
          {icon}
        </div>
        <div className="card-meta">
          <div className="card-title">{title}</div>
          <div className="card-value">{value}</div>
        </div>
      </div>

      {delta != null && (
        <div className={`card-delta ${delta >= 0 ? "up" : "down"}`}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {

   const navigate = useNavigate();

  const handleGoToCarRegister = () => {
    navigate("/admin/car/car_register");
  }

  // 예시 더미값 (나중에 API로 치환)
  const stats = {
    totalCars: 1243,
    totalSales: 4520,
    newUsersToday: 18,
    pendingApprovals: 3,
  };

  return (
    <>
      <NavbarComponent />

      <main className="admin-warpper">
        <header className="admin-hero">
          <h1 className="admin-title">관리자 대시보드</h1>
          <p className="admin-subtitle">
            주요 지표와 빠른 기능으로 시스템을 관리하세요.
          </p>
        </header>

        {/* 대시보드 지표 카드 */}
        <section className="admin-dashboard">
          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 13h4v8H3z" fill="#2a7cff" />
                <path d="M9 5h4v16H9z" fill="#a6c8ff" />
                <path d="M15 9h4v12h-4z" fill="#7fb3ff" />
              </svg>
            }
            title="등록된 차량 수"
            value={stats.totalCars.toLocaleString()}
            delta={+2.5}
          />

          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#ffd4b2" />
                <path d="M8 12h8" stroke="#ff8a50" strokeWidth="1.6" />
                <path d="M8 15h8" stroke="#ff8a50" strokeWidth="1.6" />
              </svg>
            }
            title="총 구매 건수"
            value={stats.totalSales.toLocaleString()}
            delta={+7.4}
          />

          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="#ffe5f0" />
                <path d="M7 12h10" stroke="#ff3b7a" strokeWidth="1.6" />
              </svg>
            }
            title="오늘 신규 가입자"
            value={stats.newUsersToday}
            delta={-1.2}
          />

          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#e6f7e7" />
                <path d="M12 8v8" stroke="#22a552" strokeWidth="1.5" />
              </svg>
            }
            title="승인 대기"
            value={stats.pendingApprovals}
            delta={+0.0}
          />
        </section>

        {/* 빠른 액션 버튼 영역 */}
        <section className="admin-actions">
          <div className="actions-left">
            <h2 className="section-heading">관리 기능</h2>
            <p className="muted">
              자주 사용하는 기능을 빠르게 실행하세요.
            </p>

            <div className="admin-buttons">
              <button className="admin-btn primary" onClick={handleGoToCarRegister}>
                차량 등록하기
              </button>
              <button className="admin-btn">
                차량 목록 보기
              </button>
              <button className="admin-btn">
                구매 내역 확인
              </button>
              <button className="admin-btn">
                회원 관리
              </button>
            </div>
          </div>

          <aside className="actions-right">
            <div className="quick-card">
              <div className="quick-card-title">알림</div>
              <div className="quick-card-body">
                <p>결제 미완료: <strong>12건</strong></p>
                <p>문의 대기: <strong>4건</strong></p>
              </div>
            </div>

            <div className="quick-card">
              <div className="quick-card-title">빠른 통계</div>
              <div className="quick-card-body grid">
                <div>
                  <div className="tiny-label">평균 반응 시간</div>
                  <div className="tiny-value">2시간 12분</div>
                </div>
                <div>
                  <div className="tiny-label">오늘 접속</div>
                  <div className="tiny-value">120명</div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* 최근활동(예시) */}
        <section className="recent-activity section-card">
          <h3 className="section-heading">최근 활동</h3>

          <ul className="recent-list">
            <li>
              <span className="recent-text">[주문] 구매번호 #20251209-0001 결제 완료</span>
              <span className="recent-time">10분 전</span>
            </li>
            <li>
              <span className="recent-text">[회원] 사용자 a123 님이 가입했습니다.</span>
              <span className="recent-time">1시간 전</span>
            </li>
            <li>
              <span className="recent-text">[차량] 차량 test001 이 등록되었습니다.</span>
              <span className="recent-time">3시간 전</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}