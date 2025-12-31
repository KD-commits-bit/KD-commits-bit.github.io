import React from "react";
import { Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavbarComponent({ onSearchClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)", // 살짝 투명한 배경
        backdropFilter: "blur(10px)", // 배경 흐림 효과 (고급스러움)
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)", // 가벼운 그림자
        padding: "10px 0",
        zIndex: 1000
      }}
    >
      <Container>
        {/* 브랜드 로고 */}
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "5px 0"
          }}
        >
          <img
            src="/Logo.png"
            alt="Logo"
            style={{
              height: '70px',
              width: 'auto',
              objectFit: 'contain',
              transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // 살짝 커지는 효과
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" border="0" />

        <Navbar.Collapse id="navbarScroll">
          {/* 중앙 메뉴 */}
          <Nav className="ms-4 my-2 my-lg-0" style={{ gap: "15px" }}>
            <Nav.Link onClick={() => navigate('/')} className="fw-semibold">홈</Nav.Link>
            <Nav.Link
              onClick={() => {
                if (window.location.pathname === '/') {
                  onSearchClick(); // 홈 경로일 때는 스크롤 이동
                } else {
                  navigate('/'); // 홈이 아닐 때는 홈으로 이동 (이후 스크롤 처리는 추가 로직 필요)
                }
              }}
              className="fw-semibold"
            >
              차량검색
            </Nav.Link>
            <NavDropdown title="서비스 안내" id="navbarScrollingDropdown" className="fw-semibold">
              <NavDropdown.Item href="#action3">이용 방법</NavDropdown.Item>
              <NavDropdown.Item href="#action4">예약 조회</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">고객센터</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* 우측 검색창 및 인증 버튼 */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="차량 검색..."
                className="rounded-pill px-3"
                style={{ fontSize: '14px', width: '200px', backgroundColor: '#f8f9fa', border: 'none' }}
                aria-label="Search"
              />
            </Form>

            <Nav className="gap-2">
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-3">
                  <span
                    onClick={() => user.roles?.includes('ROLE_USER') ? navigate('/mypage') : navigate('/')}
                    style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#555' }}
                  >
                    <strong>{user.name}</strong> 님
                  </span>
                  <Button
                    variant="dark"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="link"
                    className="text-decoration-none text-dark fw-medium"
                    style={{ fontSize: '14px' }}
                    onClick={() => navigate('/login')}
                  >
                    로그인
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => navigate('/register')}
                  >
                    회원가입
                  </Button>
                </>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;