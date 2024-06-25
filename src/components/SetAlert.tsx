import { type FormEvent, useState } from "react";
import FormErrorMessage from "./FormErrorMessage";

enum ApiResponseState {
  Initial,
  IsLoading,
  Success,
  UsernameNotFound,
  AlertAlreadyCreatedForUsername,
  Error,
}

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

    fetch(`${import.meta.env.PUBLIC_API_ENDPOINT}/alerts/users`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
      body: JSON.stringify({ hn_username: username, email: email }),
    })
      .then((response) => {
        if (response.status == 201) {
          setApiResponseState(ApiResponseState.Success);
          return;
        }

        if (response.status == 400) {
          return response.text().then((body) => {
            if (body == "alert already set up for HN username") {
              setApiResponseState(
                ApiResponseState.AlertAlreadyCreatedForUsername
              );
              return;
            }

            if (body == "username does not exist in HN") {
              setApiResponseState(ApiResponseState.UsernameNotFound);
              return;
            }

            throw Error(`Got response 400 with unexpected body: ${body}`);
          });
        }

        return response.text().then((body) => {
          throw Error(
            `Expected response status 201, got ${response.status}: ${response.statusText}. Error message: ${body}`
          );
        });
      })
      .catch((error: Error) => {
        setApiResponseState(ApiResponseState.Error);
        setApiError(error);
      });
  };

  if (apiResponseState == ApiResponseState.Success) {
    return (
      <p className="font-bold text-green-700">
        Thanks for signing up! You should receive a verification link via email
        (check spam). Open the link to start receiving the alerts.
      </p>
    );
  }

  return (
    <>
      <form onSubmit={submitHandler} className="space-y-3 mb-3">
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
      {apiNonSuccessOutput(apiResponseState, apiError)}
    </>
  );
}

const apiNonSuccessOutput = (state: ApiResponseState, error: Error) => {
  switch (state) {
    case ApiResponseState.IsLoading:
      return <p className="font-bold">Loading...</p>;
    case ApiResponseState.UsernameNotFound:
      return <p className="text-red-700 font-semibold">Username not found</p>;
    case ApiResponseState.AlertAlreadyCreatedForUsername:
      return (
        <p className="text-red-700 font-semibold">
          Alert already created for username
        </p>
      );
    case ApiResponseState.Error:
      return <FormErrorMessage error={error} />;
    default:
      return <></>;
  }
};
