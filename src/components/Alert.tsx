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
      <h2>{title}</h2>
      {props.items.length == 0
        ? zeroItemsMessage
        : props.items.map((item, index) => (
            <div key={index}>
              <a href={item.url}>{item.date}</a>
              <p>{item.text}</p>
            </div>
          ))}
    </div>
  );
}

export default Alert;
