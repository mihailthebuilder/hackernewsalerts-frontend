type Props = {
  items: Item[];
  type: "comment_replies" | "post_comments";
};

function formatDate(date: Date): string {
  const dateString = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateString} ${timeString}`;
}

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
                    {formatDate(item.date_published)}
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
