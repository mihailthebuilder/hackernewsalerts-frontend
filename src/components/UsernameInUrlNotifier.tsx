import { usernameInUrlStore } from "./usernameInUrlStore";

export default function UsernameInUrlNotifier() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const username = params["username"];

  if (username) {
    usernameInUrlStore.set(username.toLowerCase());
  }

  return <></>;
}
