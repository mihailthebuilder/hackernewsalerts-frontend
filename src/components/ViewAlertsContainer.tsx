import { useState, useEffect, type FormEvent } from "react";
import ViewAlert from "./ViewAlert";
import Copy from "./Copy";

import { useStore } from "@nanostores/react";
import { usernameInUrlStore } from "./usernameInUrlStore";
import { hnUsernameExists } from "./hnUsernameExists";
import FormErrorMessage from "./FormErrorMessage";

enum ApiResponseState {
  Initial,
  IsLoading,
  DataReceived,
  UsernameNotFound,
  Error,
}

function AlertsContainer({ url }: { url: string }) {
  const [username, setUsername] = useState("");
  const [alertsReceived, setAlertsReceived] = useState<Alerts>({
    comment_replies: [],
    post_comments: [],
  });
  const [apiError, setApiError] = useState<Error>(new Error());
  const [apiResponseState, setApiResponseState] = useState(
    ApiResponseState.Initial
  );

  const $usernameInUrlStore = useStore(usernameInUrlStore);

  const fetchAlertsForUsername = async (username: string) => {
    try {
      const usernameExists = await hnUsernameExists(username);

      if (!usernameExists) {
        setApiResponseState(ApiResponseState.UsernameNotFound);
        return;
      }

      setApiResponseState(ApiResponseState.IsLoading);

      const response = await fetch(
        `${import.meta.env.PUBLIC_API_ENDPOINT}/alerts/users/${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status == 404) {
        setApiResponseState(ApiResponseState.UsernameNotFound);
        return;
      }

      if (response.status != 200) {
        throw Error(
          `Expected response status 200, got ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      setApiResponseState(ApiResponseState.DataReceived);
      setAlertsReceived(data);
    } catch (error) {
      setApiResponseState(ApiResponseState.Error);
      setApiError(error as Error);
    }
  };

  useEffect(() => {
    if ($usernameInUrlStore.length > 0) {
      const newUsername = $usernameInUrlStore;
      setUsername(newUsername);
      fetchAlertsForUsername(newUsername);
    }
  }, [$usernameInUrlStore]);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    fetchAlertsForUsername(username);
  };

  const urlToCopy = `${url}?username=${username}`;

  return (
    <>
      <form onSubmit={submitHandler} className="flex mb-5">
        <input
          className="border border-black w-full block rounded focus:ring-cyan-800 p-2"
          type="text"
          placeholder="type any HN username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          required
        />
        <button
          className={`ml-5 text-white font-bold py-2 px-4 rounded w-40 ${
            apiResponseState === ApiResponseState.IsLoading
              ? "bg-gray-700 hover:bg-gray-700"
              : "bg-blue-700 hover:bg-blue-900"
          }`}
          type="submit"
          disabled={apiResponseState === ApiResponseState.IsLoading}
        >
          Get alerts
        </button>
      </form>
      {apiResponseOutput(apiResponseState, apiError, alertsReceived, urlToCopy)}
    </>
  );
}

const apiResponseOutput = (
  state: ApiResponseState,
  error: Error,
  alertsReceived: Alerts,
  urlToCopy: string
) => {
  const createCopyToClipboardFunction = (
    text: string
  ): (() => Promise<void>) => {
    return async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    };
  };

  switch (state) {
    case ApiResponseState.IsLoading:
      return <p className="font-bold">Loading...</p>;
    case ApiResponseState.UsernameNotFound:
      return (
        <p className="text-red-700 font-semibold">
          Hacker News username not found
        </p>
      );
    case ApiResponseState.Error:
      return <FormErrorMessage error={error} />;
    case ApiResponseState.DataReceived:
      return (
        <div className="space-y-7">
          <Copy onClick={createCopyToClipboardFunction(urlToCopy)}>
            <span className="underline">Copy Link</span>
          </Copy>
          <ViewAlert
            type="post_comments"
            items={alertsReceived.post_comments}
          />
          <ViewAlert
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
