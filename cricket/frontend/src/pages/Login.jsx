import React, {useState} from "react";
import {Button, Form, FloatingLabel, InputGroup, Tab, Tabs} from 'react-bootstrap';
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/login", formData);
      console.log("서버 응답:", res.data);
      alert("로그인 성공!");

      login(res.data.user); // Pass user data to login function
      navigate("/"); // Redirect to main page
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인 실패!");
    }
  };

  return (
    <div style={{padding: '50px'}}>
      <h1 onClick={() => location.href = "/"} style={{marginBottom: '30px'}}>Logo</h1>
      <div>
        <Tabs defaultActiveKey="member" id="justify-tab-example" className="mb-3" justify>
          <Tab eventKey="member" title="회원">
            <Form typeof={"post"} onSubmit={handleSubmit}>
              <FloatingLabel controlId="floatingInput" label="아이디를 입력하세요" className="mb-3">
                <Form.Control aria-label="Default" aria-describedby="inputGroup-sizing-default" type="text" name={"id"}
                              controlId="id" required={true} onChange={handleChange} placeholder="아이디를 입력하세요"/>
              </FloatingLabel>
              <FloatingLabel controlId="floatingInput" label="비밀번호를를 입력하세요" className="mb-3">
                <Form.Control aria-label="Default" aria-describedby="inputGroup-sizing-default" type="password"
                              name={"password"} controlId="password" onChange={handleChange} required={true} placeholder="비밀번호를를 입력하세요" />
              </FloatingLabel>

              <div className="d-grid gap-2">
                <Button type="submit" variant="success" size="lg">
                  로그인
                </Button>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="non-member" title="비회원">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              gap: '20px'
            }}>
              <p style={{textAlign: 'center'}}>
                본인확인이 필요합니다. <br/>
                휴대폰으로 본인인증을 해주세요.
              </p>

              <a style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
              }}>
                <img src={"/9166294.png"} alt={"phone"}
                     style={{width: '100px', marginBottom: '30px', marginLeft: '15px'}}/>
                <span><b>휴대폰 인증</b></span>
              </a>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div>
      </div>
    </div>
  );


}

export default Login;
