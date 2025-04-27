import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

function EditProfile() {
  const [userFullname] = useState(
    localStorage.getItem("psnUserFirstName") +
    " " +
    localStorage.getItem("psnUserLastName")
  );
  const [userEmail] = useState(localStorage.getItem("psnUserEmail"));
  const [userID] = useState(localStorage.getItem("psnUserId"));
  const [userBirthday] = useState(localStorage.getItem("psnUserBirthday"));

  const handleToastClick = () => {
    toast.info("This is a toast notification!");
  };

  return (
    <Container className="mt-0">
      <h2>Profile</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{userFullname}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{userEmail}</td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>{userBirthday}</td>
          </tr>
          <tr>
            <td>ID</td>
            <td>{userID}</td>
          </tr>
        </tbody>
      </Table>
      <Button variant="primary" onClick={handleToastClick}>
        <FontAwesomeIcon icon={faBell} /> Show Notifications
      </Button>
      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}

export default EditProfile;
