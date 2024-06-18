type Item = {
  url: string;
  text: string;
  date: string;
};

type Alerts = {
  comment_replies: Item[];
  post_comments: Item[];
};
