type Props = {
  items: Item[];
  type: "comment_replies" | "post_comments";
};

function renderedText(input: string): string {
  if (input.length < 100) return input;

  return input.slice(0, 100) + "...";
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
                <a
                  href={item.url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  {item.date}
                </a>
                <p>{renderedText(item.text)}</p>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Alert;
