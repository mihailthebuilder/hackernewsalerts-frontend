type Props = {
  items: Item[];
  type: "comment_replies" | "post_comments";
};

function Alert(props: Props) {
  const title =
    props.type === "comment_replies"
      ? "New comment replies"
      : "New post comments";

  const zeroItemsMessage =
    props.type === "comment_replies" ? "No replies" : "No comments";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <div className="space-y-4">
        {props.items.length == 0
          ? zeroItemsMessage
          : props.items.map((item, index) => (
              <div key={index}>
                <div>
                  <a
                    href={item.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    {item.date_published.toDateString()}
                  </a>{" "}
                  -{" "}
                  <a
                    href={item.author.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    {item.author.name}
                  </a>
                </div>

                <div dangerouslySetInnerHTML={{ __html: item.content_html }} />
              </div>
            ))}
      </div>
    </div>
  );
}

export default Alert;
