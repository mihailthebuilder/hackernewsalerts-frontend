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
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="HN username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <button type="submit">Get alerts</button>
      </form>
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
