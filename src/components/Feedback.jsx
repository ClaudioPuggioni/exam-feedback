import { Field, Form, Formik, ErrorMessage } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { checkUsers, leaveFback } from "../features/dataSlice";

export default function Feedback() {
  const dispatch = useDispatch();
  const cabinet = useSelector((state) => state.cabinet);
  const location = useLocation();

  useEffect(() => {
    dispatch(checkUsers(location.pathname.slice(1)));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {!cabinet.feedbackUser ? null : (
        <Formik
          initialValues={{
            feedback: "",
          }}
          validationSchema={Yup.object({
            feedback: Yup.string().min(3, "Minimum 3 characters").max(15, "Exceeded 15 character limit").required("Required"),
          })}
          onSubmit={(values) => {
            values.username = cabinet.feedbackUser;
            console.log(values);

            dispatch(leaveFback(values));
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="form-sector">
                <label>Username</label>
                <Field type="text" name="feedback" className="fBackAreaField">
                  {() => <textarea className="fBackArea" placeholder="Leave feedback here" name="feedback" onChange={(e) => setFieldValue("feedback", e.target.value)}></textarea>}
                </Field>
                <ErrorMessage className="errorMsg" name="username" component="div" />
              </div>
              <button id="submitButton" type="submit" disabled={cabinet.loading}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
