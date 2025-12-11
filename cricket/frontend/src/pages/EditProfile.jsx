import React, { useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import api from '../api/axios';
import {useAuth} from "../hooks/useAuth.js"; // Assuming axios is configured and exported as 'api'

export default function EditProfile({user}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
    emailId: user.id ? user.id.split("@")[0] : '',
    emailDomain: user.id.split("@")[1],
    customDomain: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const domain =
      formData.emailDomain === "직접 입력"
        ? formData.customDomain
        : formData.emailDomain;

    try {
      const updatedData = {
        userId: user.id,
        password: formData.newPassword || undefined,
        email: `${formData.emailId}@${domain}`,
      };

      // Filter out undefined values if password is not changed
      const payload = Object.fromEntries(Object.entries(updatedData).filter(([_, v]) => v !== undefined));

      const response = await api.put('/api/user/profile', payload); // Adjust endpoint as needed
      console.log('Update successful:', response.data);
      alert('프로필이 성공적으로 업데이트되었습니다.\n다시 로그인해주세요.');

      logout();
      navigate('/');
    } catch (error) {
      console.error('Update failed:', error);
      alert('프로필 업데이트에 실패했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  console.log("User:", user);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px", padding: "80px"}}>
      <h3 className="mb-4 fw-bold">회원정보 수정</h3>
      <p>
        꼭 알아두세요!
      </p>
      <p className="text-muted small">
        • H Car는 고객님의 동의 없이 제3자에게 정보를 제공하지 않습니다.
      </p>
      <br/>
      <Form onSubmit={handleSubmit}>
        {/* 고객명 */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3" className="fw-bold">고객명</Form.Label>
          <Col sm="9">
            <Form.Control type="text" value={user.name} disabled />
          </Col>
        </Form.Group>

        {/* 휴대폰 번호 */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3" className="fw-bold">휴대폰번호</Form.Label>
          <Col sm="9">
            <InputGroup>
              <Form.Control type="text" value={user.phone} disabled />
              <Button variant="outline-secondary" className="ms-2">번호 변경</Button>
            </InputGroup>
          </Col>
        </Form.Group>

        {/* 새 비밀번호 */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3" className="fw-bold">새 비밀번호</Form.Label>
          <Col sm="9">
            <Form.Control
              type="password"
              placeholder="비밀번호 입력"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        {/* 새 비밀번호 확인 */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3" className="fw-bold">새로운 비밀번호 확인</Form.Label>
          <Col sm="9">
            <Form.Control
              type="password"
              placeholder="비밀번호 재입력"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        {/* 이메일 */}
        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm="3" className="fw-bold">이메일</Form.Label>
          <Col sm="9">
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                />
              </Col>
              <Col xs="auto" className="d-flex align-items-center">
                @
              </Col>
              <Col>
                {/* 도메인이 '직접 입력'일 경우 → 텍스트 입력창 */}
                {formData.emailDomain === "직접 입력" ? (
                  <Form.Control
                    type="text"
                    name="customDomain"
                    placeholder="도메인 입력"
                    value={formData.customDomain || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Select
                    name="emailDomain"
                    value={formData.emailDomain}
                    onChange={handleChange}
                  >
                    <option>{user.id.split("@")[1]}</option>
                    <option>naver.com</option>
                    <option>gmail.com</option>
                    <option>daum.net</option>
                    <option>직접 입력</option>
                  </Form.Select>
                )}
              </Col>
            </Row>
          </Col>
        </Form.Group>

        {/* 이메일 */}
        <Form.Group className="mb-5">
          <Row>
            <Col>
              <Form.Label className="fw-bold">회원 탈퇴</Form.Label>
            </Col>
            <Col>
              <Button variant="outline-secondary">회원 탈퇴</Button>
            </Col>
          </Row>
        </Form.Group>

        <div className="text-center mt-4">
          <Button variant="outline-secondary" size="lg" className="px-5 me-3" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type={"submit"} variant="primary" size="lg" className="px-5" >
            저장하기
          </Button>
        </div>
      </Form>

    </div>
  );
}
