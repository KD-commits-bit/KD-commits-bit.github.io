import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card, Row, Col, FloatingLabel, InputGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    userEmail: "", userPassword: "", userName: "", userNickname: "", userPhone: "",
    zipcode: "", sido: "", sigungu: "", eupmyundong: "", roadName: "",
    addressLine1: "", addressLine2: "", isDefault: 1
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const navigate = useNavigate();

  const isPasswordMatch = form.userPassword !== "" && form.userPassword === passwordConfirm;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (checked ? 1 : 0) : value });
    if (name === "userEmail") {
      setEmailChecked(false);
      setEmailCheckMessage("");
    }
  };

  const handlePost = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          sido: data.sido,
          sigungu: data.sigungu,
          eupmyundong: data.bname,
          roadName: data.roadname,
          addressLine1: data.roadAddress,
          addressLine2: ""
        }));
      }
    }).open();
  };

  const handleCheckEmail = () => {
    if (!form.userEmail) {
      setEmailCheckMessage("이메일을 입력해주세요.");
      return;
    }
    axios.get(`/api/register/check-email?email=${form.userEmail}`)
      .then((res) => {
        setEmailChecked(true);
        setEmailAvailable(!res.data.isDuplicated);
        setEmailCheckMessage(res.data.isDuplicated ? "이미 사용중인 이메일입니다." : "사용 가능한 이메일입니다.");
      })
      .catch(() => setEmailCheckMessage("중복 확인 오류 발생"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailChecked || !emailAvailable) {
      toast.error("이메일 중복 확인을 해주세요.");
      return;
    }

    if (form.userPassword !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    axios.post("http://localhost:8080/api/register", form)
      .then(() => {
        toast.success("반갑습니다! 가입이 완료되었습니다.");
        navigate("/login");
      })
      .catch(() => alert("가입 실패. 입력 정보를 확인해주세요."));
  };

  return (
    <div className="register-bg">
      <Container className="py-5" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-4">
          <img
            src="/Logo.png"
            alt="Logo"
            onClick={() => navigate("/")}
            style={{ height: '55px', cursor: "pointer" }}
          />
          <h4 className="fw-bold mt-3">회원가입</h4>
        </div>

        <Card className="register-card border-0 shadow-lg mx-auto">
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              {/* 섹션 1: 계정 정보 */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-primary border-start border-4 border-primary ps-2">계정 정보</h6>
                <Row className="g-2">
                  <Col md={8}>
                    <FloatingLabel label="이메일 주소">
                      <Form.Control type="email" name="userEmail" value={form.userEmail} onChange={handleChange} placeholder="name@example.com" required />
                    </FloatingLabel>
                  </Col>
                  <Col md={4} className="d-grid">
                    <Button variant="outline-primary" onClick={handleCheckEmail} style={{fontSize:'14px'}}>중복 확인</Button>
                  </Col>
                  <div className={`small ps-2 mb-2 ${emailAvailable ? "text-success" : "text-danger"}`}>{emailCheckMessage}</div>

                  <Col md={12}>
                    <FloatingLabel label="비밀번호">
                      <Form.Control
                        type="password"
                        name="userPassword"
                        value={form.userPassword}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  {/* 비밀번호 확인 입력 */}
                  <Col md={12}>
                    <FloatingLabel label="비밀번호 확인">
                      <Form.Control
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        isInvalid={passwordConfirm !== "" && !isPasswordMatch} // 틀렸을 때 빨간 테두리
                        isValid={passwordConfirm !== "" && isPasswordMatch}   // 맞았을 때 초록 테두리
                      />
                      {/* 피드백 메시지 */}
                      <Form.Control.Feedback type="invalid">
                        비밀번호가 일치하지 않습니다.
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="valid">
                        비밀번호가 일치합니다.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={12} className="mb-2">
                    <FloatingLabel label="이름">
                      <Form.Control name="userName" value={form.userName} onChange={handleChange} placeholder="Name" required />
                    </FloatingLabel>
                  </Col>
                  <Col md={12}>
                    <FloatingLabel label="전화번호">
                      <Form.Control name="userPhone" value={form.userPhone} onChange={handleChange} placeholder="Phone" required />
                    </FloatingLabel>
                  </Col>
                </Row>
              </div>

              {/* 섹션 2: 주소 정보 */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-primary border-start border-4 border-primary ps-2">주소 정보</h6>
                <Row className="g-2">
                  <Col md={8}>
                    <FloatingLabel label="우편번호">
                      <Form.Control name="zipcode" value={form.zipcode} readOnly placeholder="Zipcode" required />
                    </FloatingLabel>
                  </Col>
                  <Col md={4} className="d-grid">
                    <Button variant="secondary" onClick={handlePost} style={{fontSize:'14px'}}>검색</Button>
                  </Col>
                  <Col md={12}>
                    <FloatingLabel label="기본 주소">
                      <Form.Control name="addressLine1" value={form.addressLine1} readOnly placeholder="Address" />
                    </FloatingLabel>
                  </Col>
                  <Col md={12}>
                    <FloatingLabel label="상세 주소">
                      <Form.Control name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Detail Address" />
                    </FloatingLabel>
                  </Col>
                </Row>
              </div>

              <Form.Check type="checkbox" label="기본 배송지로 설정" name="isDefault" checked={form.isDefault === 1} onChange={handleChange} className="mb-4 text-muted small" />

              <Button type="submit" size="lg" className="w-100 rounded-pill fw-bold py-3 shadow-sm" style={{ background: 'linear-gradient(45deg, #0d6efd, #00c6ff)', border: 'none', fontSize:'16px' }}>
                가입 완료
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}