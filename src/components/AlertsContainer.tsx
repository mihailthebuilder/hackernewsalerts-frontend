import { useState, type FormEvent } from "react";
import Alert from "./Alert";

const API_HOST = "https://socialalerts.app.taralys.com";
// const API_HOST = "http://127.0.0.1:8000";

enum ApiResponseState {
  Initial,
  IsLoading,
  DataReceived,
  UsernameNotFound,
  Error,
}

function AlertsContainer() {
  const [username, setUsername] = useState("");
  const [alertsReceived, setAlertsReceived] = useState<Alerts>({
    comment_replies: [],
    post_comments: [],
  });
  const [apiError, setApiError] = useState<Error>(new Error());
  const [apiResponseState, setApiResponseState] = useState(
    ApiResponseState.Initial
  );

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    setApiResponseState(ApiResponseState.IsLoading);

    fetch(`${API_HOST}/alerts/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.status == 404) {
          setApiResponseState(ApiResponseState.UsernameNotFound);
          return;
        }

        if (response.status != 200) {
          throw Error(
            `Expected response status 200, got ${response.status}: ${response.statusText}`
          );
        }

        response.json().then((data: Alerts) => {
          setApiResponseState(ApiResponseState.DataReceived);
          setAlertsReceived(data);
        });
      })
      .catch((error: Error) => {
        setApiResponseState(ApiResponseState.Error);
        setApiError(error);
      });
  };

  return (
    <>
      <form onSubmit={submitHandler} className="flex mb-5">
        <input
          className="border border-black w-full block rounded focus:ring-cyan-800 p-2"
          type="text"
          placeholder="type any HN username"
          onChange={(event) => setUsername(event.target.value.toLowerCase())}
          value={username}
          required
        />
        <button
          className={`ml-5 text-white font-bold py-2 px-4 rounded w-40 ${
            apiResponseState === ApiResponseState.IsLoading
              ? "bg-gray-700 hover:bg-gray-700"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          type="submit"
          disabled={apiResponseState === ApiResponseState.IsLoading}
        >
          Get alerts
        </button>
      </form>
      {apiResponseOutput(apiResponseState, apiError, alertsReceived)}
    </>
  );
}

const apiResponseOutput = (
  state: ApiResponseState,
  error: Error,
  alertsReceived: Alerts
) => {
  switch (state) {
    case ApiResponseState.IsLoading:
      return <p className="font-bold">Loading...</p>;
    case ApiResponseState.UsernameNotFound:
      return <p className="text-red-700 font-semibold">Username not found</p>;
    case ApiResponseState.Error:
      return (
        <p className="text-red-700 font-semibold">
          Something went wrong, error message{" "}
          <span className="inline-block">'{error.message}'</span>. Please reach
          out to me{" "}
          <a
            className="underline inline-block"
            href="https://linkedin.com/in/mihailmarian"
          >
            on LinkedIn
          </a>{" "}
          for help.
        </p>
      );
    case ApiResponseState.DataReceived:
      return (
        <div className="space-y-7">
          <Alert type="post_comments" items={alertsReceived.post_comments} />
          <Alert
            type="comment_replies"
            items={alertsReceived.comment_replies}
          />
        </div>
      );
    default:
      return <></>;
  }
};

export default AlertsContainer;
