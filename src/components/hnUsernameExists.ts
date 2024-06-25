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

  if (response.status != 200) {
    throw Error(
      `Expected response status 200, got ${response.status}: ${response.statusText}`
    );
  }

  const body = await response.text();

  return body == "null";
};
