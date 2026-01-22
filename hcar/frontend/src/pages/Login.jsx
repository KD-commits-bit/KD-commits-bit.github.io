import React, { useState } from "react";
import { Button, Form, FloatingLabel, Tab, Tabs, Card, Container } from 'react-bootstrap';
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import '../css/Login.css';

function Login() {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/api/auth/login", formData);
      toast.success(`${res.data.user.name}님, 환영합니다!`);
      login(res.data);
      navigate("/");
    } catch (err) {
      toast.error("아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/api/auth/login", formData);
      const roles = res.data?.user?.roles || [];
      if (!roles.includes("ROLE_ADMIN")) {
        toast.error("관리자 계정이 아닙니다.");
        return;
      }
      login(res.data);
      toast.success("관리자 로그인 성공!");
      navigate("/admin");
    } catch (err) {
      toast.error("관리자 인증에 실패했습니다.");
    }
  };

  const handleGoogleLogin = () => {
    // Spring Security의 기본 OAuth2 로그인 엔드포인트로 이동
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-bg" style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(25, 135, 84, 0.03)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(220, 53, 69, 0.03)', zIndex: 0
      }}></div>
      <Container style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <img
            src="/Logo.png"
            alt="Logo"
            onClick={() => navigate("/")}
            style={{
              height: '70px',
              cursor: "pointer",
              filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.1))'}}
          />
        </div>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-4">
            <Tabs defaultActiveKey="member" className="custom-tabs mb-4" justify>
              {/* 일반 회원 탭 */}
              <Tab eventKey="member" title="회원 로그인">
                <Form className="mt-3" onSubmit={handleSubmit}>
                  <FloatingLabel label="아이디" className="mb-3">
                    <Form.Control type="text" name="id" required onChange={handleChange} placeholder="id" />
                  </FloatingLabel>
                  <FloatingLabel label="비밀번호" className="mb-4">
                    <Form.Control type="password" name="password" required onChange={handleChange} placeholder="password" />
                  </FloatingLabel>
                  <div className="d-grid">
                    <Button type="submit" variant="success" size="lg" className="rounded-pill fw-bold">
                      로그인
                    </Button>
                  </div>

                  {/* 소셜 로그인 섹션 */}
                  <div className="d-flex align-items-center my-4">
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
                    <span className="mx-3 text-muted" style={{ fontSize: '12px' }}>간편 로그인</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
                  </div>

                  <div className="d-grid gap-2">
                    {/* 공통 스타일: height: '45px'로 통일 */}

                    {/* 구글 버튼 */}
                    <Button
                      variant="light"
                      onClick={handleGoogleLogin}
                      className={'google-login'}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        style={{ width: '18px', position: 'absolute', left: '15px' }}
                        alt="google"
                      />
                      <span className="w-100 text-center">Google로 로그인</span>
                    </Button>

                    {/* 카카오 버튼 */}
                    <Button
                      onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/kakao"}
                      className={'kakao-login'}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
                        style={{ width: '20px', position: 'absolute', left: '14px' }}
                        alt="kakao"
                      />
                      <span className="w-100 text-center">카카오 로그인</span>
                    </Button>

                    {/* 네이버 버튼 */}
                    <Button
                      onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/naver"}
                      className={'naver-login'}
                    >
                      <img
                        src="https://www.naver.com/favicon.ico"
                        style={{ width: '20px', position: 'absolute', left: '14px' }}
                        alt="naver"
                      />
                      <span className="w-100 text-center">네이버 로그인</span>
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-3">
                  <small className="text-muted">계정이 없으신가요? </small>
                  <small className="text-primary" style={{cursor:'pointer'}} onClick={()=>navigate('/register')}>회원가입</small>
                </div>
              </Tab>

              {/* 비회원 탭 */}
              <Tab eventKey="non-member" title="비회원 인증">
                <div className="text-center py-4">
                  <div className="mb-3">
                    <img src="/9166294.png" alt="phone" style={{ width: '80px', opacity: 0.8 }} />
                  </div>
                  <p className="mb-4 text-secondary" style={{ fontSize: '14px' }}>
                    본인확인이 필요합니다.<br/>휴대폰으로 본인인증을 해주세요.
                  </p>
                  <Button variant="outline-dark" className="rounded-pill px-4 fw-bold">
                    휴대폰 인증하기
                  </Button>
                </div>
              </Tab>

              {/* 관리자 탭 */}
              <Tab eventKey="admin" title="관리자">
                <Form className="mt-3" onSubmit={handleAdminSubmit}>
                  <div className="alert alert-light text-center py-2" style={{fontSize: '13px', color: '#dc3545'}}>
                    관리자 전용 로그인 세션입니다.
                  </div>
                  <FloatingLabel label="관리자 ID" className="mb-3">
                    <Form.Control type="text" name="id" required onChange={handleChange} placeholder="admin id" />
                  </FloatingLabel>
                  <FloatingLabel label="비밀번호" className="mb-4">
                    <Form.Control type="password" name="password" required onChange={handleChange} placeholder="password" />
                  </FloatingLabel>
                  <div className="d-grid">
                    <Button type="submit" variant="danger" size="lg" className="rounded-pill fw-bold">
                      관리자 인증
                    </Button>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
        <p className="text-center mt-4 text-muted" style={{ fontSize: '13px' }}>
          &copy; 2026 Your Car Service. All rights reserved.
        </p>
      </Container>
    </div>
  );
}

export default Login;