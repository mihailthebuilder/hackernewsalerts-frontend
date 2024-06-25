import { type FormEvent, useState } from "react";

enum ApiResponseState {
  Initial,
  IsLoading,
  DataReceived,
  UsernameNotFound,
  Error,
}

export default function SetAlert() {
  const [username, setUsername] = useState("");
  const [apiResponseState, setApiResponseState] = useState(
    ApiResponseState.Initial
  );

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
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
        onChange={(event) => setUsername(event.target.value.toLowerCase())}
        value={username}
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
