type GetNewPostCommentsResult = {
  user_found: boolean;
  items: Item[];
};

const BASE_URL = import.meta.env.PUBLIC_HNRSS_REVERSE_PROXY;

export async function getNewCommentReplies(
  username: string,
  oldestDateConsidered: Date
): Promise<Item[]> {
  const repliesUrl = `${BASE_URL}/replies.jsonfeed?id=${username}`;
  const response = await fetch(repliesUrl);

  if (!response.ok) {
    throw Error(
      `fetch HN replies error: expected status ok, got ${response.status}: ${response.statusText}`
    );
  }

  const repliesResponseJson = await response.json();

  const replies: Item[] = repliesResponseJson.items.map((reply: Item) => ({
    ...reply,
    date_published: new Date(reply.date_published),
  }));

  const filteredReplies = replies.filter(
    (reply) =>
      reply.author.name !== username &&
      reply.date_published > oldestDateConsidered
  );

  return filteredReplies;
}

export async function getNewPostComments(
  username: string,
  oldestDateConsidered: Date
): Promise<GetNewPostCommentsResult> {
  const postsUrl = `${BASE_URL}/submitted.jsonfeed?id=${username}`;
  const response = await fetch(postsUrl);

  if (!response.ok) {
    throw Error(
      `fetch HN submitted error: expected status ok, got ${response.status}: ${response.statusText}`
    );
  }

  const postsResponseJson = await response.json();
  const result: GetNewPostCommentsResult = { user_found: false, items: [] };

  if (!postsResponseJson || !postsResponseJson.items) {
    return result;
  }

  result.user_found = true;

  const posts: Item[] = postsResponseJson.items.map((post: Item) => ({
    ...post,
    date_published: new Date(post.date_published),
  }));

  const oldestActivePostDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const postsOpenForDiscussion = posts.filter(
    (post: Item) => post.date_published > oldestActivePostDate
  );

  for (const post of postsOpenForDiscussion) {
    const parsedUrl = new URL(post.external_url);
    const postId = parsedUrl.searchParams.get("id");

    const commentsUrl = `${BASE_URL}/item.jsonfeed?id=${postId}`;
    const commentsResponse = await fetch(commentsUrl);
    if (!response.ok) {
      throw Error(
        `fetch HN comments error: expected status ok, got ${response.status}: ${response.statusText}`
      );
    }

    const commentsResponseJson = await commentsResponse.json();

    if (!commentsResponseJson.items) {
      continue;
    }

    const comments: Item[] = commentsResponseJson.items.map(
      (comment: Item) => ({
        ...comment,
        date_published: new Date(comment.date_published),
      })
    );

    const filteredComments = comments.filter(
      (comment) =>
        comment.author.name !== username &&
        comment.date_published > oldestDateConsidered
    );

    result.items = result.items.concat(filteredComments);
  }

  return result;
}
