import React, {useEffect, useState} from "react";
import { Form, Button, Container, Card, InputGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    userEmail: "",
    userPassword: "",
    userName: "",
    userNickname: "",
    userPhone: "",

    // USER_ADDRESS
    zipcode: "",
    sido: "",
    sigungu: "",
    eupmyundong: "",
    roadName: "",
    addressLine1: "",
    addressLine2: "",
    isDefault: 1
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    });

    if (name === "userEmail") {
      setEmailChecked(false);
      setEmailCheckMessage("");
    }
  };

  const handlePost = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let roadAddr = data.roadAddress; // 도로명 주소
        let extraRoadAddr = "";

        // 법정동
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }

        // 건물명
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraRoadAddr +=
            extraRoadAddr !== ""
              ? `, ${data.buildingName}`
              : data.buildingName;
        }

        if (extraRoadAddr !== "") {
          extraRoadAddr = ` (${extraRoadAddr})`;
        }

        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          sido: data.sido,
          sigungu: data.sigungu,
          eupmyundong: data.bname,
          roadName: data.roadname,
          addressLine1: roadAddr,
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

    axios
      .get(`http://localhost:8080/api/register/check-email?email=${form.userEmail}`)
      .then((response) => {
        setEmailChecked(true);
        if (response.data.isDuplicated) {
          setEmailAvailable(false);
          setEmailCheckMessage("이미 사용중인 이메일입니다.");
        } else {
          setEmailAvailable(true);
          setEmailCheckMessage("사용 가능한 이메일입니다.");
        }
      })
      .catch(() => {
        setEmailCheckMessage("이메일 중복 확인에 실패했습니다.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailChecked || !emailAvailable) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    axios
      .post("http://localhost:8080/api/register", form)
      .then(() => {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      })
      .catch(() => {
        alert("회원가입에 실패했습니다.");
      });
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Card.Header>회원가입</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* 이메일 */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="userEmail"
                      value={form.userEmail}
                      onChange={handleChange}
                      required
                    />
                    <Button type="button" variant="outline-secondary" onClick={handleCheckEmail}>
                      중복 확인
                    </Button>
                  </InputGroup>
                  <Form.Text className={emailAvailable ? "text-success" : "text-danger"}>
                    {emailCheckMessage}
                  </Form.Text>
                </Form.Group>
              </Col>
              {/* 비밀번호 */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="userPassword"
                    value={form.userPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* 비밀번호 */}
            <Row>
              <Col md={6}>
                {/* 전화번호 */}
                <Form.Group className="mb-3">
                  <Form.Label>전화번호</Form.Label>
                  <Form.Control
                    name="userPhone"
                    value={form.userPhone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>이름</Form.Label>
                  <Form.Control name="userName" value={form.userName} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <hr />

            {/* 주소 */}

            <Form.Group className="mb-2">
              <Form.Label>우편번호</Form.Label>
              <InputGroup>
                <Form.Control name="zipcode" value={form.zipcode} readOnly required />
                <Button variant="outline-secondary" onClick={handlePost}>
                  우편번호 검색
                </Button>
              </InputGroup>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>시/도</Form.Label>
                  <Form.Control name="sido" value={form.sido} readOnly required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>시/군/구</Form.Label>
                  <Form.Control name="sigungu" value={form.sigungu} readOnly required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>읍/면/동</Form.Label>
                  <Form.Control
                    name="eupmyundong"
                    value={form.eupmyundong}
                    readOnly
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>도로명</Form.Label>
                  <Form.Control
                    name="roadName"
                    value={form.roadName}
                    readOnly
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>기본주소</Form.Label>
                  <Form.Control name="addressLine1" value={form.addressLine1} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>상세주소</Form.Label>
              <Form.Control
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="기본 배송지로 설정"
              name="isDefault"
              checked={form.isDefault === 1}
              onChange={handleChange}
              className="mb-3"
            />

            <Button type="submit" className="w-100">
              회원가입
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
