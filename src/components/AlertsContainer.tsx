import { useState, type FormEvent } from "react";
import Alert from "./Alert";

const API_HOST = import.meta.env.PROD
  ? "https://socialalerts.app.taralys.com"
  : "http://127.0.0.1:8000";

function AlertsContainer() {
  const [username, setUsername] = useState("");
  const [alertsReceived, setAlertsReceived] = useState<Alerts>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    setAlertsReceived(undefined);
    setIsLoading(true);
    fetch(`${API_HOST}/alerts/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.status != 200) {
          throw Error(
            `Expected response status 200, got ${response.status}: ${response.statusText}`
          );
        }

        return response.json();
      })
      .then((data: Alerts) => {
        setAlertsReceived(data);
      })
      .catch((error: Error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={submitHandler} className="flex mb-5">
        <input
          className="border border-black lowercase w-full block rounded focus:ring-cyan-800 p-2"
          type="text"
          placeholder="type any HN username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          required
        />
        <button
          className={`ml-5 text-white font-bold py-2 px-4 rounded w-40 ${
            isLoading
              ? "bg-gray-700 hover:bg-gray-700"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          type="submit"
          disabled={isLoading}
        >
          Get alerts
        </button>
      </form>
      {isLoading && <p className="font-bold">Loading...</p>}
      {alertsReceived && (
        <>
          <Alert type="post_comments" items={alertsReceived.post_comments} />
          <Alert
            type="comment_replies"
            items={alertsReceived.comment_replies}
          />
        </>
      )}
    </>
  );
}

export default AlertsContainer;
