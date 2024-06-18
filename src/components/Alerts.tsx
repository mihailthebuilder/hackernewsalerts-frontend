import { useState, type FormEvent } from "react";

function Alerts() {
  const [username, setUsername] = useState("");

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    console.log(username);
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="HN username"
        onChange={(event) => setUsername(event.target.value)}
        value={username}
      />
      <button type="submit">Get alerts</button>
    </form>
  );
}

export default Alerts;
