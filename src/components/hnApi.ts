type ItemAuthor = {
  name: string;
  url: string;
};

type HnItem = {
  id: string;
  title: string;
  content_html: string;
  url: string;
  external_url: string;
  date_published: Date;
  author: ItemAuthor;
};

type GetNewPostCommentsResult = {
  user_found: boolean;
  items: HnItem[];
};

async function getNewCommentReplies(
  username: string,
  oldestDateConsidered: Date
): Promise<HnItem[]> {
  const repliesUrl = `https://hnrss.org/replies.jsonfeed?id=${username}`;
  const response = await fetch(repliesUrl);
  const repliesResponseJson = await response.json();
  const replies = repliesResponseJson.items.map((reply: any) => ({
    ...reply,
    date_published: new Date(reply.date_published),
  }));

  const filteredReplies = replies.filter(
    (reply: HnItem) =>
      reply.author.name !== username &&
      reply.date_published > oldestDateConsidered
  );

  return filteredReplies;
}

async function getNewPostComments(
  username: string,
  oldestDateConsidered: Date
): Promise<GetNewPostCommentsResult> {
  const postsUrl = `https://hnrss.org/submitted.jsonfeed?id=${username}`;
  const response = await fetch(postsUrl);
  const postsResponseJson = await response.json();
  const result: GetNewPostCommentsResult = { user_found: false, items: [] };

  if (!postsResponseJson || !postsResponseJson.items) {
    return result;
  }

  result.user_found = true;

  const posts = postsResponseJson.items.map((post: any) => ({
    ...post,
    date_published: new Date(post.date_published),
  }));

  const oldestActivePostDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const postsOpenForDiscussion = posts.filter(
    (post: HnItem) => post.date_published > oldestActivePostDate
  );

  for (const post of postsOpenForDiscussion) {
    const parsedUrl = new URL(post.external_url);
    const postId = parsedUrl.searchParams.get("id");

    if (!postId) continue;

    const commentsUrl = `https://hnrss.org/item.jsonfeed?id=${postId}`;
    const commentsResponse = await fetch(commentsUrl);
    const commentsResponseJson = await commentsResponse.json();

    if (!commentsResponseJson || !commentsResponseJson.items) {
      continue;
    }

    const comments = commentsResponseJson.items.map((comment: any) => ({
      ...comment,
      date_published: new Date(comment.date_published),
    }));

    const filteredComments = comments.filter(
      (comment: HnItem) =>
        comment.author.name !== username &&
        comment.date_published > oldestDateConsidered
    );

    result.items = result.items.concat(filteredComments);
  }

  return result;
}
