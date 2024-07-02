type ItemAuthor = {
  name: string;
  url: string;
};

type Item = {
  id: string;
  title: string;
  content_html: string;
  url: string;
  external_url: string;
  date_published: Date;
  author: ItemAuthor;
};

type Alerts = {
  comment_replies: Item[];
  post_comments: Item[];
};
