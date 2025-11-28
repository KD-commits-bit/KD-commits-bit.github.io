import React, {useState} from "react";
import {Form, Button, Container, Card, InputGroup} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    userEmail: "",
    userPassword: "",
    userName: "",
    userNickname: "",
    userRegion: "",
    userPhone: "",
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
    if (e.target.name === "userEmail") {
      setEmailChecked(false);
      setEmailCheckMessage("");
    }
  };

  const handleCheckEmail = () => {
    if (!form.userEmail) {
      setEmailCheckMessage("이메일을 입력해주세요.");
      return;
    }
    axios.get(`http://localhost:8080/api/register/check-email?email=${form.userEmail}`)
      .then(response => {
        setEmailChecked(true);

        if (response.data.isDuplicated) {
          setEmailAvailable(false);
          setEmailCheckMessage("이미 사용중인 이메일입니다.");
        } else {
          setEmailAvailable(true);
          setEmailCheckMessage("사용 가능한 이메일입니다.");
        }
      })
      .catch(error => {
        console.error("Email check failed", error);
        setEmailCheckMessage("이메일 중복 확인에 실패했습니다.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailChecked || !emailAvailable) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }
    axios.post("http://localhost:8080/api/register", form)
      .then(response => {
        console.log("Registration successful", response.data);
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      })
      .catch(error => {
        console.error("Registration failed", error);
        alert("회원가입에 실패했습니다.");
      });
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Card.Header>회원가입</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>이메일</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="userEmail"
                  value={form.userEmail}
                  onChange={handleChange}
                  placeholder="이메일 입력"
                  required
                />
                <Button variant="outline-secondary" onClick={handleCheckEmail}>
                  중복 확인
                </Button>
              </InputGroup>
              <Form.Text className={emailAvailable ? "text-success" : "text-danger"}>
                {emailCheckMessage}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="userPassword"
                value={form.userPassword}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="이름 입력"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                name="userNickname"
                value={form.userNickname}
                onChange={handleChange}
                placeholder="닉네임 입력"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>지역</Form.Label>
              <Form.Control
                type="text"
                name="userRegion"
                value={form.userRegion}
                onChange={handleChange}
                placeholder="지역 입력"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                type="text"
                name="userPhone"
                value={form.userPhone}
                onChange={handleChange}
                placeholder="전화번호 입력"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              회원가입
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
