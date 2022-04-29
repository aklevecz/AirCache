import { Formik } from "formik";
import { useState } from "react";
import Spinner from "../components/Loading/Spinner";
import useAirCache from "../hooks/useAirCache";
import { SPOTTED_PIGS_ADDRESS } from "../libs/constants";
import {
  approveToken,
  getMaticProvider,
  getMumbaiProvider,
} from "../libs/utils";

export default function Fill() {
  const [submitting, setSubmitting] = useState(false);
  const airCache = useAirCache(null);
  return (
    <div>
      <h1>Approve Egg</h1>
      <ApproveForm setSubmitting={setSubmitting} />
      <h1>Fill Egg</h1>
      <FillForm
        fillCache={airCache.fillCache}
        setSubmitting={setSubmitting}
        submitting={submitting}
      />
    </div>
  );
}

const ApproveForm = ({ setSubmitting, submitting }: any) => (
  <Formik
    initialValues={{
      tokenAddress: SPOTTED_PIGS_ADDRESS,
      tokenId: 0,
    }}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        approveToken(
          values.tokenId,
          values.tokenAddress,
          process.env.NODE_ENV === "development"
            ? getMumbaiProvider().getSigner()
            : getMaticProvider().getSigner()
        );
      }, 1000);
    }}
  >
    {(props) => (
      <form onSubmit={props.handleSubmit}>
        <div>
          <div>token address</div>
          <input
            type="text"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.tokenAddress}
            name="tokenAddress"
          />
          {props.errors.tokenAddress && (
            <div id="feedback">{props.errors.tokenAddress}</div>
          )}
        </div>
        <div>
          <div>token id</div>
          <input
            type="text"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.tokenId}
            name="tokenId"
          />
          {props.errors.tokenId && (
            <div id="feedback">{props.errors.tokenId}</div>
          )}
        </div>
        <button type="submit">{submitting ? <Spinner /> : "Submit"}</button>
      </form>
    )}
  </Formik>
);

const FillForm = ({
  fillCache,
  setSubmitting,
  submitting,
}: {
  fillCache: (
    cacheId: number,
    tokenId: number,
    tokenAddress: string
  ) => Promise<boolean>;
  setSubmitting: any;
  submitting: boolean;
}) => (
  <Formik
    initialValues={{
      tokenAddress: SPOTTED_PIGS_ADDRESS,
      tokenId: 0,
      cacheId: 0,
    }}
    onSubmit={(values, actions) => {
      setSubmitting(true);
      setTimeout(async () => {
        const success = await fillCache(
          values.cacheId,
          values.tokenId,
          values.tokenAddress
        );
        setSubmitting(false);
        console.log(success);
      }, 1000);
    }}
  >
    {(props) => (
      <form onSubmit={props.handleSubmit}>
        <div>
          <div>token address</div>
          <input
            type="text"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.tokenAddress}
            name="tokenAddress"
          />
          {props.errors.tokenAddress && (
            <div id="feedback">{props.errors.tokenAddress}</div>
          )}
        </div>
        <div>
          <div>token id</div>
          <input
            type="text"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.tokenId}
            name="tokenId"
          />
          {props.errors.tokenId && (
            <div id="feedback">{props.errors.tokenId}</div>
          )}
        </div>
        <div>
          <div>cache id</div>
          <input
            type="text"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.cacheId}
            name="cacheId"
          />
          {props.errors.tokenId && (
            <div id="feedback">{props.errors.cacheId}</div>
          )}
        </div>
        <button type="submit">{submitting ? <Spinner /> : "Submit"}</button>
      </form>
    )}
  </Formik>
);
