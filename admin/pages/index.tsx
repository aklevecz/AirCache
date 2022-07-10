import { Field, Form, Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Thumb from "../components/Thumb";
import db from "../libs/db";

type Group = {
  name: string;
};

type Props = {
  groups: Group[];
};

type Values = {
  name: string;
  location: string;
  image: any;
};

const Home: NextPage<Props> = ({ groups }) => {
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
            location: "",
            image: null,
          }}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <label htmlFor="name">Name</label>
              <Field id="name" name="name" placeholder="Name" />

              <label htmlFor="location">Location</label>
              <Field id="location" name="location" placeholder="3000,-3000" />

              <label htmlFor="marker">Marker</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget && event.currentTarget.files) {
                    console.log(event.currentTarget.files[0]);
                    setFieldValue("image", event.currentTarget.files[0]);
                  }
                }}
              />
              <Thumb file={values.image} />
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
