import { Field, Form, Formik, ErrorMessage } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { leaveFback } from "../features/dataSlice";

export default function Feedback() {
  const dispatch = useDispatch();
  const cabinet = useSelector((state) => state.cabinet);
  return (
    <Formik
      initialValues={{
        feedback: "",
      }}
      validationSchema={Yup.object({
        feedback: Yup.string().min(3, "Minimum 3 characters").max(15, "Exceeded 15 character limit").required("Required"),
      })}
      onSubmit={(values) => {
        dispatch(leaveFback(values));
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div className="form-sector">
            <label>Username</label>
            <Field name="feedback" placeholder="Leave feedback here" className="inputField">
              {() => {
                <textarea name="feedback" onChange={(e) => setFieldValue("feedback", e.target.value)}></textarea>;
              }}
            </Field>
            <ErrorMessage className="errorMsg" name="username" component="div" />
          </div>
          <button id="submitButton" type="submit" disabled={cabinet.loading}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
