import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        <strong>Stoep is a fictional demo.</strong> The homes, hosts and prices are made up, nothing is charged, and bookings only live in this browser. The
        photos show real South African places, not the homes, and are public-domain (CC0) images. <Link to="/credits">Photo credits</Link>
      </p>
    </footer>
  );
}
