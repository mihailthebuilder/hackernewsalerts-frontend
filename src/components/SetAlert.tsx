import { type FormEvent, useState } from "react";

enum ApiResponseState {
  Initial,
  IsLoading,
  Success,
  UsernameNotFound,
  Error,
}

const API_HOST = "https://socialalerts.app.taralys.com";
// const API_HOST = "http://127.0.0.1:8000";

export default function SetAlert() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [apiResponseState, setApiResponseState] = useState(
    ApiResponseState.Initial
  );
  const [apiError, setApiError] = useState<Error>(new Error());

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

        setApiResponseState(ApiResponseState.Success);
      })
      .catch((error: Error) => {
        setApiResponseState(ApiResponseState.Error);
        setApiError(error);
      });
  };

  return (
    <form onSubmit={submitHandler} className="space-y-3">
      <input
        className="border border-black w-full block rounded focus:ring-cyan-800 p-2 col-span-6"
        type="text"
        placeholder="HN username"
        onChange={(event) => setUsername(event.target.value.toLowerCase())}
        value={username}
        required
      />
      <input
        className="border border-black w-full block rounded focus:ring-cyan-800 p-2 col-span-6"
        type="email"
        placeholder="email"
        onChange={(event) => setEmail(event.target.value.toLowerCase())}
        value={email}
        required
      />
      <button
        className={`text-white font-bold py-2 px-4 rounded w-40 ${
          apiResponseState === ApiResponseState.IsLoading
            ? "bg-gray-700 hover:bg-gray-700"
            : "bg-blue-700 hover:bg-blue-900"
        }`}
        type="submit"
        disabled={apiResponseState === ApiResponseState.IsLoading}
      >
        Sign up
      </button>
    </form>
  );
}
