import { Link } from "react-router-dom";

export function NotFoundPage({ message = "That page doesn't exist." }: { message?: string }) {
  return (
    <section className="empty-state page-message">
      <h1>Nothing here</h1>
      <p>{message}</p>
      <Link to="/" className="button button-primary">
        Browse homes
      </Link>
    </section>
  );
}
