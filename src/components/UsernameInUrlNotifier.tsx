import { usernameInUrlStore } from "../usernameInUrlStore";

export default function HexCodeInUrlNotifier() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const username = params["username"];

  if (username) {
    usernameInUrlStore.set(username);
  }

  return <></>;
}
