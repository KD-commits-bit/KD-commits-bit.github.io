import React, {useEffect, useState} from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { useAuth } from "../hooks/useAuth.js";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import './Mypage.css';

export default function EditProfile({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  console.log(user);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          addressLine1: data.roadAddress,
          sido: data.sido,
          sigungu: data.sigungu,
          eupmyundong: data.bname,
          roadName: data.roadname,
          addressLine2: ""
        }));
      }
    }).open();
  };

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
    emailId: user.id ? user.id.split("@")[0] : '',
    emailDomain: user.id ? user.id.split("@")[1] : '',
    customDomain: '',
    zipcode: user.zipcode || '',
    addressLine1: user.addressLine1 || '',
    addressLine2: user.addressLine2 || '',
    sido: user.sido || '',
    sigungu: user.sigungu || '',
    eupmyundong: user.eupmyundong || '',
    roadName: user.roadName || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const domain = formData.emailDomain === "직접 입력" ? formData.customDomain : formData.emailDomain;

    try {
      const updatedData = {
        userId: user.id,
        password: formData.newPassword || undefined,
        email: `${formData.emailId}@${domain}`,
        zipcode: formData.zipcode,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        sido: formData.sido,
        sigungu: formData.sigungu,
        eupmyundong: formData.eupmyundong,
        roadName: formData.roadName
      };

      const payload = Object.fromEntries(Object.entries(updatedData).filter(([_, v]) => v !== undefined));
      await api.put('/api/user/profile', payload);

      // 성공 시 세련된 알림 후 로그아웃
      await Swal.fire({
        title: '수정 완료!',
        text: '보안을 위해 다시 로그인해주세요.',
        icon: 'success',
        confirmButtonColor: '#0d6efd'
      });

      logout();
      navigate('/');
    } catch (error) {
      toast.error('업데이트 실패: ' + (error.response?.data?.message || '잠시 후 다시 시도해주세요.'));
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '정말 탈퇴하시겠습니까?',
      text: "그동안 쌓인 모든 정보가 영구 삭제됩니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '탈퇴하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      customClass: {
        confirmButton: 'rounded-pill px-4 me-2',
        cancelButton: 'rounded-pill px-4'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await api.delete('/api/user/delete');
        await Swal.fire('탈퇴 완료', '정상적으로 처리되었습니다.', 'success');
        logout();
        navigate('/');
      } catch (e) {
        toast.error('탈퇴 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="mypage-wrapper"> {/* 배경색 유지를 위해 동일 클래스 사용 */}
      <Container style={{ maxWidth: "700px" }}>
        <Card className="profile-edit-card border-0 shadow-sm">
          <Card.Body className="p-5">
            <h3 className="mb-4 fw-bold text-center">회원정보 수정</h3>
            <div className="info-notice mb-5">
              <p className="fw-bold mb-1">💡 꼭 알아두세요!</p>
              <p className="text-muted small mb-0">• H Car는 고객님의 동의 없이 제3자에게 정보를 제공하지 않습니다.</p>
              <p className="text-muted small">• 개인정보 변경 시 보안을 위해 재로그인이 필요합니다.</p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* 고객명 (Read Only) */}
              <div className="mb-4">
                <Form.Label className="fw-bold small text-secondary">고객명</Form.Label>
                <Form.Control type="text" value={user.name} disabled className="bg-light border-0 py-2" />
              </div>

              {/* 비밀번호 섹션 */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Label className="fw-bold small text-secondary">새 비밀번호</Form.Label>
                  <Form.Control type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="변경 시 입력" className="py-2" />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-bold small text-secondary">비밀번호 확인</Form.Label>
                  <Form.Control type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="한 번 더 입력" className="py-2" />
                </Col>
              </Row>

              {/* 이메일 섹션 */}
              <div className="mb-5">
                <Form.Label className="fw-bold small text-secondary">이메일 주소</Form.Label>
                <Row className="g-2 align-items-center">
                  <Col>
                    <Form.Control type="text" name="emailId" value={formData.emailId} onChange={handleChange} className="py-2" />
                  </Col>
                  <Col xs="auto">@</Col>
                  <Col>
                    {formData.emailDomain === "직접 입력" ? (
                      <Form.Control type="text" name="customDomain" placeholder="도메인 입력" value={formData.customDomain} onChange={handleChange} className="py-2" />
                    ) : (
                      <Form.Select name="emailDomain" value={formData.emailDomain} onChange={handleChange} className="py-2">
                        <option value={user.id.split("@")[1]}>{user.id.split("@")[1]}</option>
                        <option>naver.com</option>
                        <option>gmail.com</option>
                        <option>daum.net</option>
                        <option>직접 입력</option>
                      </Form.Select>
                    )}
                  </Col>
                </Row>
              </div>

              <div className="mb-5">
                <Form.Label className="fw-bold small text-secondary">주소 정보</Form.Label>
                <Row className="g-2 mb-2">
                  <Col xs={8} md={4}>
                    <Form.Control
                      type="text"
                      placeholder="우편번호"
                      name="zipcode"
                      value={formData.zipcode}
                      readOnly
                      className="bg-light py-2 border-0"
                    />
                  </Col>
                  <Col xs={4} md={3}>
                    <Button
                      variant="dark"
                      className="w-100 py-2 small fw-bold"
                      onClick={handleAddressSearch}
                    >
                      주소 검색
                    </Button>
                  </Col>
                </Row>
                <Form.Control
                  type="text"
                  name="addressLine1"
                  placeholder="기본 주소"
                  value={formData.addressLine1}
                  readOnly
                  className="bg-light mb-2 py-2 border-0"
                />
                <Form.Control
                  type="text"
                  name="addressLine2"
                  placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="py-2"
                />
              </div>

              {/* 하단 버튼 */}
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" className="w-100 rounded-pill py-3 fw-bold" onClick={() => navigate(-1)}>취소</Button>
                <Button type="submit" variant="primary" className="w-100 rounded-pill py-3 fw-bold shadow-sm">저장하기</Button>
              </div>

              <hr className="my-5" />

              <div className="d-flex justify-content-between align-items-center text-muted">
                <span className="small">서비스를 더 이상 이용하지 않으시나요?</span>
                <Button variant="link" className="text-danger text-decoration-none small" onClick={handleDelete}>회원 탈퇴</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}