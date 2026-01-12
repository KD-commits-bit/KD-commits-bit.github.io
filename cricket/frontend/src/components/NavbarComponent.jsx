import React, {useState} from "react";
import {Button, Container, Form, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import toast from "react-hot-toast";

function NavbarComponent({onSearchClick, onGlobalSearch}) {
  const navigate = useNavigate();
  const {user, logout, isAuthenticated} = useAuth();
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    logout();
    toast('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
    }
    onGlobalSearch(keyword);
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        background: "rgba(255, 255, 255, 0.85)", // 투명도 조절
        backdropFilter: "blur(15px) saturate(180%)", // 흐림 및 채도 조절로 더 화사하게
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)", // 더 부드러운 그림자
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        zIndex: 1000
      }}
    >
      <Container>
        {/* 브랜드 로고 */}
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{ cursor: "pointer", alignItems: "center", padding: "0" }}
        >
          <img
            src="/Logo.png"
            alt="Logo"
            style={{
              height: '70px',
              transition: 'all 0.3s ease',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" border="0"/>

        <Navbar.Collapse id="navbarScroll">
          {/* 중앙 메뉴 */}
          <Nav className="ms-lg-5 gap-lg-3" style={{ fontSize: '15px' }}>
            {['홈', '차량검색'].map((item) => (
              <Nav.Link
                key={item}
                onClick={() => {
                  if (item === '홈') navigate('/');
                  else window.location.pathname === '/' ? onSearchClick() : navigate('/');
                }}
                className="fw-bold px-3 text-dark custom-nav-link"
                style={{ transition: 'color 0.2s' }}
              >
                {item}
              </Nav.Link>
            ))}
            <NavDropdown title="서비스 안내" id="navbarScrollingDropdown" className="fw-bold px-2">
              <NavDropdown.Item href="#action3">이용 방법</NavDropdown.Item>
              <NavDropdown.Item href="#action4">예약 조회</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">고객센터</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* 우측 검색창 및 인증 버튼 */}
          <div className="ms-auto d-flex align-items-center gap-4">
            {/* 검색바 디자인 개선 */}
            <Form className="d-none d-xl-flex position-relative" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="어떤 차를 찾으시나요?"
                className="rounded-pill border-0 px-4"
                style={{
                  fontSize: '13px',
                  width: '240px',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  height: '40px'
                }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Form>

            <Nav className="align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  {user.roles?.includes("ROLE_ADMIN") && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-pill px-3 fw-bold border-0"
                      style={{
                        fontSize: '12px',
                        background: 'linear-gradient(45deg, #007bff, #00c6ff)',
                        boxShadow: '0 4px 10px rgba(0, 123, 255, 0.25)',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      onClick={() => navigate('/admin')}
                    >
                      관리자 페이지
                    </Button>
                  )}

                  <div
                    className="d-flex align-items-center px-2 py-1 rounded-pill"
                    style={{ backgroundColor: 'rgba(0,0,0,0.03)', cursor: 'pointer' }}
                    onClick={() => user.roles?.includes("ROLE_USER") ? navigate('/mypage') : navigate('/')}
                  >
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:'28px', height:'28px', fontSize:'12px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                      👤
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {user.name}
                    </span>
                  </div>

                  <Button
                    variant="link"
                    size="sm"
                    className="text-decoration-none text-muted fw-medium p-0 ms-2"
                    style={{ fontSize: '13px' }}
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="link"
                    className="text-decoration-none text-dark fw-bold"
                    style={{ fontSize: '14px' }}
                    onClick={() => navigate('/login')}
                  >
                    로그인
                  </Button>
                  <Button
                    variant="dark"
                    size="sm"
                    className="rounded-pill px-4 fw-bold shadow-sm"
                    style={{ fontSize: '14px', height: '38px' }}
                    onClick={() => navigate('/register')}
                  >
                    시작하기
                  </Button>
                </div>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
      <style>{`
        .custom-nav-link:hover {
          color: #007bff !important;
          background: rgba(0, 123, 255, 0.05);
          border-radius: 20px;
        }
        .dropdown-toggle::after {
          vertical-align: middle;
          border-top: 0.4em solid;
          border-right: 0.3em solid transparent;
          border-left: 0.3em solid transparent;
        }
      `}</style>
    </Navbar>
  );
}

export default NavbarComponent;