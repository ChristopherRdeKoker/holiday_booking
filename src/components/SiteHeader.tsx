import { Link, NavLink } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { Icon, type IconNameType } from "@/components/Icon";
import { useBookings, useFavourites, useToday } from "@/hooks/useAppStores";
import { cn } from "@/lib/cn";

type NavItemProps = {
  to: string;
  icon: IconNameType;
  label: string;
  count: number;
  end?: boolean;
};

function NavItem({ to, icon, label, count, end }: NavItemProps) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => cn("nav-item", isActive && "is-active")}>
      <Icon name={icon} />
      <span className="nav-label">{label}</span>
      {!!count && <span className="nav-count">{count}</span>}
    </NavLink>
  );
}

export function SiteHeader() {
  const { favourites } = useFavourites();
  const { bookings } = useBookings();
  const today = useToday();
  const upcomingCount = bookings.filter((booking) => booking.status === "confirmed" && booking.checkOut > today).length;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <BrandMark />
          <span className="brand-name">Stoep</span>
          <span className="demo-pill">Demo</span>
        </Link>
        <nav className="main-nav" aria-label="Main">
          <NavItem to="/" end icon="search" label="Explore" count={0} />
          <NavItem to="/saved" icon="heart" label="Saved" count={favourites.size} />
          <NavItem to="/bookings" icon="suitcase" label="Bookings" count={upcomingCount} />
        </nav>
      </div>
    </header>
  );
}
