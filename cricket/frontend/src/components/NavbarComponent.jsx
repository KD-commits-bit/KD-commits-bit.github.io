import React from "react";
import {Button, Container, Form, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavbarComponent() {
  let navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  console.log(user);

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        style={{ padding: "20px" }}
      >
        <Container fluid>
          <Navbar.Brand href="/">Logo</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link onClick={() => {navigate('/')}}>Home</Nav.Link>
              <Nav.Link onClick={() => {navigate('/')}}>Link</Nav.Link>
              <NavDropdown
                title="Link"
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link
                href="#"
                disabled
              >
                Link
              </Nav.Link>
            </Nav>

            <Nav>
              {isAuthenticated ? (
                <>
                  <Navbar.Text className="me-3">
                    Welcome, {user.name}
                  </Navbar.Text>
                  <Button variant="outline-success" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link style={{fontSize: '14px'}} onClick={() => {navigate('/login')}}>로그인</Nav.Link>
                  <Nav.Link style={{fontSize: '14px'}} onClick={() => {navigate('/register')}}>회원가입</Nav.Link>
                </>
              )}
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
