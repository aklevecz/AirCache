import { signIn, useSession } from "next-auth/react";
import GoogleIcon from "../Icons/Google";
import Layout from "../Layout";
import PageHeader from "../Layout/PageHeader";

export default function Signin() {
  const { data: session } = useSession();

  const onSignin = () => signIn("google");
  return (
    <Layout>
      {/* <PageHeader>Sign in</PageHeader> */}
      <div className="text-center mt-10 text-2xl">Sign in using Google</div>
      <button className="m-auto mt-10" onClick={onSignin}>
        <GoogleIcon style={{ marginRight: 10 }} /> Sign in
      </button>
    </Layout>
  );
}
