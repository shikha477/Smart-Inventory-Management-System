import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link className="btn btn-primary" to="/">
        Back to dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
