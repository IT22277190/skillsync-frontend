import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import logo from "./assets/psn-logo-large.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

import {
  RiNewspaperLine,
  RiRadarLine,
  RiBaseStationLine,
  RiFolderUserLine,
  RiLogoutBoxLine,
  RiAccountCircleLine 
} from "react-icons/ri";

import styles from "./styles/NewsFeed.module.css";

function NewsFeed() {
  let navigate = useNavigate();

  function handleClick(e) {
    navigate("/newsfeed/allaccounts");
  }

  function handleSignOut(e) {
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
  });

  return (
    // <div className={styles.background}>
    <Container className="pt-3">
      <Row className="mb-3">
        <Col md={4}>
          <Row className="justify-content-center align-items-center">
            <Col md="auto" className="text-sm-start text-center mb-sm-0 mb-3">
              <img src={logo} width="80" alt="logo" />
            </Col>
            <Col className="text-sm-start text-center text-dark mb-sm-0 mb-3">
              <h2>Social Network</h2>
            </Col>
          </Row>
        </Col>
        <Col md={8}>
          <div className="d-flex justify-content-end align-items-center w-100 h-100">
            <Button variant="primary" onClick={handleClick}>
            <FontAwesomeIcon icon={faUserFriends} style={{ marginRight:'20px'}}/>
              Find Friends
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Navbar bg="light" expand="lg" className="mb-3 mb-sm-0">
            <Container className={styles.navbarContainer}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className={styles.navContainer}>
                <ul className="list-group">
                <Nav.Link>
                  <Link to="" className="text-decoration-none">
                    <li className="list-group-item fs-5 py-3 text-primary shadow">
                      <span>
                        {" "}
                        <RiNewspaperLine /> Newsfeed
                      </span>
                    </li>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="following" className="text-decoration-none">
                    <li className="list-group-item fs-5 py-3 text-dark shadow">
                      <span>
                        <RiRadarLine /> Following
                      </span>
                    </li>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="follower" className="text-decoration-none">
                    <li className="list-group-item fs-5 py-3 text-dark shadow">
                      <span>
                        <RiBaseStationLine /> Followers
                      </span>
                    </li>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="myprofile" className="text-decoration-none">
                    <li className="list-group-item fs-5 py-3 text-dark shadow">
                      <span>
                        <RiFolderUserLine /> My Posts
                      </span>
                    </li>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="editeprofile" className="text-decoration-none">
                    <li className="list-group-item fs-5 py-3 text-dark shadow">
                      <span>
                      <RiAccountCircleLine /> My Profile
                      </span>
                    </li>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                <li
                  className={`list-group-item fs-5 py-3 text-success shadow ${styles.signOutButton}`}
                  onClick={handleSignOut}
                >
                  <span style={{ color: 'red' }}>
                    <RiLogoutBoxLine /> Sign Out
                  </span>
                </li>

                </Nav.Link>
                </ul>
              </Nav>
            </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
        <Col md={8}>
          <Outlet />{" "}
        </Col>
      </Row>
    </Container>
    //</div>
  );
}

export default NewsFeed;
