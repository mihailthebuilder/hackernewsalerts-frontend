export default function FormErrorMessage({ error }: { error: Error }) {
  return (
    <p className="text-red-700 font-semibold">
      Something went wrong, error message{" "}
      <span className="inline-block">'{error.message}'</span>. Check the{" "}
      <a href="#contact" className="underline inline-block">
        contact section
      </a>{" "}
      to see how you can reach out to me for help.
    </p>
  );
}
