import { useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import SectionHeading from "../Layout/SectionHeading";

type Values = {
  name: string;
  description: string;
  location: string;
  magicLinkType: string;
  markerEmpty: any;
  markerFilled: any;
  huntType: string;
  contract: string;
};

const uploadSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  location: Yup.string().required(),
  magicLinkType: Yup.string().required(),
  markerEmpty: Yup.mixed().required(),
  markerFilled: Yup.mixed().required(),
});

export default function CreateHuntForm() {
  const [previewImgEmpty, setPreviewImgEmpty] = useState<any>(null);
  const [previewImgFilled, setPreviewImgFilled] = useState<any>(null);

  return (
    <div>
      <SectionHeading>create hunt</SectionHeading>
      <Formik
        initialValues={{
          name: "",
          description: "",
          location: "",
          magicLinkType: "",
          markerEmpty: null,
          markerFilled: null,
          huntType: "",
          contract: "",
        }}
        validationSchema={uploadSchema}
        onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
          const body = new FormData();
          body.append("name", values.name);
          body.append("description", values.description);
          body.append("location", values.location);
          body.append("magicLinkType", values.magicLinkType);
          body.append("markerEmpty", values.markerEmpty);
          body.append("markerFilled", values.markerFilled);
          body.append("huntType", values.huntType);
          body.append("contract", values.contract);

          fetch("/api/upload", { method: "POST", body });
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="field-container">
              <label htmlFor="name">Name</label>
              <Field id="name" name="name" placeholder="Name" />
            </div>
            <div className="field-container">
              <label htmlFor="description">Description</label>
              <Field id="description" name="description" placeholder="Description" />
            </div>
            <div className="field-container">
              <label htmlFor="location">Location</label>
              <Field id="location" name="location" placeholder="3000,-3000" />
            </div>
            <div className="field-container">
              <label htmlFor="magicLinkType">Magic Link Type</label>
              <Field id="magicLinkType" name="magicLinkType" placeholder="connect or auth" />
            </div>
            <div className="field-container">
              <label htmlFor="huntType">Hunt Type</label>
              <Field id="huntType" name="huntType" placeholder="claim | word | prog" />
            </div>
            <div className="field-container">
              <label htmlFor="contract">Contract</label>
              <Field id="contract" name="contract" placeholder="contract" />
            </div>
            <div className="field-container">
              <label htmlFor="markerEmpty">Marker Empty</label>
              <input
                id="markerEmpty"
                name="markerEmpty"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget && event.currentTarget.files) {
                    const i = event.currentTarget.files[0];
                    setFieldValue("markerEmpty", i);
                    setPreviewImgEmpty(URL.createObjectURL(i));
                  }
                }}
              />
            </div>
            <img src={previewImgEmpty} />
            <div className="field-container">
              <label htmlFor="markerFilled">Marker Filled</label>
              <input
                id="markerFilled"
                name="markerFilled"
                type="file"
                title=" "
                onChange={(event) => {
                  if (event.currentTarget && event.currentTarget.files) {
                    const i = event.currentTarget.files[0];
                    setFieldValue("markerFilled", i);
                    setPreviewImgFilled(URL.createObjectURL(i));
                  }
                }}
              />
            </div>
            <img
              onClick={() => {
                setFieldValue("markerFilled", "");

                console.log("hi");
              }}
              src={previewImgFilled}
            />
            <button className="mt-5" type="submit">
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <style jsx>{`
        .field-container {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        input[type="file"] {
          color: white;
        }
        img {
          max-width: 50%;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}
