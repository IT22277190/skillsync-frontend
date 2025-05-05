import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import logo from "./assets/psn-logo-large.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import {
  RiNewspaperLine,
  RiRadarLine,
  RiBaseStationLine,
  RiFolderUserLine,
  RiLogoutBoxLine,
  RiAccountCircleLine,
} from "react-icons/ri";

function NewsFeed() {
  let navigate = useNavigate();

  function handleClick() {
    navigate("/newsfeed/allaccounts");
  }

  function handleSignOut() {
    localStorage.removeItem("psnUserId");
    localStorage.removeItem("psnToken");
    localStorage.removeItem("psnUserFirstName");
    localStorage.removeItem("psnUserLastName");
    localStorage.removeItem("psnUserEmail");
    localStorage.removeItem("psnUserBirthday");
    navigate("/");
  }

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <Container className="pt-3">
        <Row className="mb-3">
          <Col md={4}>
            <Row className="justify-content-center align-items-center">
              <Col md="auto" className="text-sm-start text-center mb-sm-0 mb-3">
                <img src={logo} width="80" alt="logo" />
              </Col>
              <Col className="text-sm-start text-center text-dark mb-sm-0 mb-3">
                <h2>Social Media</h2>
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <div className="d-flex justify-content-end align-items-center w-100 h-100">
              <Button variant="primary" onClick={handleClick}>
                <FontAwesomeIcon icon={faUserFriends} style={{ marginRight: "10px" }} />
                Find Friends
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Navbar
              expand="lg"
              className="mb-3 mb-sm-0"
              style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px" }}
            >
              <Container style={{ padding: "0" }}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                  <Nav style={{ flexDirection: "column", width: "100%" }}>
                    <ul style={{ listStyle: "none", paddingLeft: 0, width: "100%" }}>
                      <Nav.Link as="div">
                        <Link to="" style={{ textDecoration: "none" }}>
                          <li
                            style={{
                              padding: "12px 16px",
                              fontSize: "16px",
                              marginBottom: "10px",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              color: "#1877f2",
                            }}
                          >
                            <RiNewspaperLine /> Newsfeed
                          </li>
                        </Link>
                      </Nav.Link>
                      <Nav.Link as="div">
                        <Link to="following" style={{ textDecoration: "none" }}>
                          <li
                            style={{
                              padding: "12px 16px",
                              fontSize: "16px",
                              marginBottom: "10px",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              color: "#050505",
                            }}
                          >
                            <RiRadarLine /> Following
                          </li>
                        </Link>
                      </Nav.Link>
                      <Nav.Link as="div">
                        <Link to="follower" style={{ textDecoration: "none" }}>
                          <li
                            style={{
                              padding: "12px 16px",
                              fontSize: "16px",
                              marginBottom: "10px",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              color: "#050505",
                            }}
                          >
                            <RiBaseStationLine /> Followers
                          </li>
                        </Link>
                      </Nav.Link>
                      <Nav.Link as="div">
                        <Link to="myprofile" style={{ textDecoration: "none" }}>
                          <li
                            style={{
                              padding: "12px 16px",
                              fontSize: "16px",
                              marginBottom: "10px",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              color: "#050505",
                            }}
                          >
                            <RiFolderUserLine /> My Posts
                          </li>
                        </Link>
                      </Nav.Link>
                      <Nav.Link as="div">
                        <Link to="editeprofile" style={{ textDecoration: "none" }}>
                          <li
                            style={{
                              padding: "12px 16px",
                              fontSize: "16px",
                              marginBottom: "10px",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              color: "#050505",
                            }}
                          >
                            <RiAccountCircleLine /> My Profile
                          </li>
                        </Link>
                      </Nav.Link>
                      <Nav.Link as="div">
                        <li
                          onClick={handleSignOut}
                          style={{
                            padding: "12px 16px",
                            fontSize: "16px",
                            marginBottom: "10px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            color: "red",
                            cursor: "pointer",
                          }}
                        >
                          <RiLogoutBoxLine /> Sign Out
                        </li>
                      </Nav.Link>
                    </ul>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Col>
          <Col md={8}>
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                minHeight: "80vh",
              }}
            >
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NewsFeed;
