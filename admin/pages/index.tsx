import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import type { NextPage } from "next";
import { useState } from "react";
import db from "../libs/db";

// {
// ["coindesk-austin"]: {
//   title: "Coindesk Egg Hunt",
//   description: "Find eggs filled with NFT Longhorns scattered around Austin!",
//   image: `${host}/coindesk-austin-banner.png`,
//   map_center: cityCenters.austin,
//   icon: { useNFT: false, image: { empty: hornEgg, filled: hornEgg } },
// }
// }

type Group = {
  name: string;
};

type Props = {
  groups: Group[];
};

type Values = {
  name: string;
  description: string;
  location: string;
  markerEmpty: any;
  markerFilled: any;
};

const uploadSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  location: Yup.string().required(),
  markerEmpty: Yup.mixed().required(),
  markerFilled: Yup.mixed().required(),
});

const Home: NextPage<Props> = ({ groups }) => {
  const [previewImgEmpty, setPreviewImgEmpty] = useState<any>(null);
  const [previewImgFilled, setPreviewImgFilled] = useState<any>(null);

  if (!groups) {
    return <div>loading...</div>;
  }
  return (
    <div className="text-white">
      <div className="border">
        <div className="uppercase">available hunts</div>
        {groups.map((group) => (
          <div key={group.name}>{group.name}</div>
        ))}
      </div>
      <div>
        <div className="uppercase">create hunt</div>
        <Formik
          initialValues={{
            name: "",
            description: "",
            location: "34.08326394070492,-118.21794546931355",
            markerEmpty: null,
            markerFilled: null,
          }}
          validationSchema={uploadSchema}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            const body = new FormData();
            body.append("name", values.name);
            body.append("description", values.description);
            body.append("location", values.location);
            body.append("markerEmpty", values.markerEmpty);
            body.append("markerFilled", values.markerFilled);

            fetch("/api/upload", { method: "POST", body });
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div>
                <label htmlFor="name">Name</label>
                <Field id="name" name="name" placeholder="Name" />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Field
                  id="description"
                  name="description"
                  placeholder="Description"
                />
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <Field id="location" name="location" placeholder="3000,-3000" />
              </div>
              <div>
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
              <div>
                <label htmlFor="markerFilled">Marker Filled</label>
                <input
                  id="markerFilled"
                  name="markerFilled"
                  type="file"
                  onChange={(event) => {
                    if (event.currentTarget && event.currentTarget.files) {
                      const i = event.currentTarget.files[0];
                      setFieldValue("markerFilled", i);
                      setPreviewImgFilled(URL.createObjectURL(i));
                    }
                  }}
                />
              </div>
              <img src={previewImgFilled} />
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const params = {
    TableName: "air-yaytso-groups",
  };
  const dbRes = await db.scan(params).promise();
  const groups = dbRes.Items;
  console.log(groups);
  return { props: { groups } };
};
