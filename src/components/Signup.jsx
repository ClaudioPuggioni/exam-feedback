import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signup } from "../features/dataSlice";
import * as Yup from "yup";

export default function Signup() {
  const dispatch = useDispatch();
  const cabinet = useSelector((state) => state.cabinet);

  useEffect(() => {
    console.log(cabinet);
    // eslint-disable-next-line
  }, []);

  return (
    <div id="signupContainer">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          passwordConfirmation: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().min(3, "Minimum 3 characters").max(15, "Exceeded 15 character limit").required("Required"),
          email: Yup.string().email("Invalid email address").required("Required"),
          password: Yup.string().min(8, "Minimum 8 characters").max(15, "Exceeded 15 character limit").required("Required"),
          passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
        })}
        onSubmit={(values) => {
          dispatch(signup(values));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-sector">
              <label>Username</label>
              <Field type="username" name="username" placeholder="username" className="inputField" />
              <ErrorMessage className="errorMsg" name="username" component="div" />
            </div>
            <div className="form-sector">
              <label>Email</label>
              <Field type="email" name="email" placeholder="email@domain.com" className="inputField" />
              <ErrorMessage className="errorMsg" name="email" component="div" />
            </div>
            <div className="form-sector">
              <label>Password</label>
              <Field type="password" name="password" placeholder="password" className="inputField" />
              <ErrorMessage className="errorMsg" name="password" component="div" />
            </div>
            <div className="form-sector">
              <label>Password check</label>
              <Field type="password" name="passwordConfirmation" placeholder="password" className="inputField" />
              <ErrorMessage className="errorMsg" name="passwordConfirmation" component="div" />
            </div>
            <button id="submitButton" type="submit" disabled={cabinet.loading}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <Link to={"/login"}>Already Registered? Log In!</Link>
    </div>
  );
}
