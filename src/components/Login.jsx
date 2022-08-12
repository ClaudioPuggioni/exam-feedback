import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../features/dataSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function Login() {
  const dispatch = useDispatch();
  const cabinet = useSelector((state) => state.cabinet);

  return (
    <div id="loginContainer">
      <Formik
        initialValues={{
          username: "",
          password: "",
          passwordConfirmation: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().min(3, "Minimum 3 characters").max(15, "Exceeded 15 character limit").required("Required"),
          password: Yup.string().min(8, "Minimum 8 characters").max(15, "Exceeded 15 character limit").required("Required"),
          passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
        })}
        onSubmit={(values) => {
          dispatch(login(values));
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
      <Link to={"/signup"}>Not Registered? Create New Account</Link>
    </div>
  );
}
