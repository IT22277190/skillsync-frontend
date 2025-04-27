import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { BsFillPersonPlusFill } from "react-icons/bs";

import styles from "./styles/SignUp.module.css";
import Container from "react-bootstrap/esm/Container";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [userRole, setUserRole] = useState("user");
  const [resData, setResData] = useState(null);
  
  let navigate = useNavigate();

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email().required("Valid email is required"),
    password: yup.string().required("Password is required"),
    birthday: yup.string().required("Birthday is required"),
  });

  async function postSignUpInfo(inputData) {
    const response = await axios({
      method: "post",
      url: "/api/v1/users/save",
      data: {
        firstName: inputData.firstName,
        lastName: inputData.lastName,
        email: inputData.email,
        birthday: inputData.birthday,
        password: inputData.password,
        role: userRole,
      },
    });

    if (response.data !== null) {
      setResData(response.data);
    }
    
    if (response.data !== null && response.data.status === "fail") {
      showWarningToast(response.data.message);      
    }

    if (response.data!== null && response.data.status === "success") {
      navigate("/signin");
    }

  }

  function showWarningToast(inputMessage) {
    toast.warn(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  return (
    <div className={styles.background}> {/* Added background image class */}
      <Container fluid className={styles.container} >
        <ToastContainer />
        <Formik
          validationSchema={schema}
          initialValues={{
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            birthday: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            // console.log(values);
            postSignUpInfo(values);
            setSubmitting(false);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isInValid,
            errors,
          }) => (
            
            <Form
              noValidate
              onSubmit={handleSubmit}
              className={styles.formContainer}
            >
              <Row className="mb-3 text-center">
                <h1 className="text-primary">Sign Up</h1>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="signInFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    className={styles.customInput}
                    isInvalid={touched.firstName && errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your first name
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="signInLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    className={styles.customInput}
                    isInvalid={touched.lastName && errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your last name
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="signInEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className={styles.customInput}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              {/* Added Birthday Field */}
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="signUpBirthday">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={values.birthday}
                    onChange={handleChange}
                    className={styles.customInput}
                    isInvalid={touched.birthday && errors.birthday}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.birthday}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-5">
                <Form.Group as={Col} md="12" controlId="signInPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    className={styles.customInput}
                    isInvalid={touched.password && errors.password}
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter your password
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Button className="mb-3" type="submit" variant="primary">
                Sign Up <BsFillPersonPlusFill />
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export default SignUp;
