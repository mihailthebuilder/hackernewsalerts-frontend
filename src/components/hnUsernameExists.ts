export const hnUsernameExists = async (username: string) => {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/user/${username}.json`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const body = await response.text();

  if (response.status != 200) {
    throw Error(
      `Can't verify username; got status ${response.status}: ${response.statusText}. Message: ${body}`
    );
  }

  return body == "null";
};
