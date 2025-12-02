import { NavLink } from "react-router-dom";
import { navItems } from "@/constant/navigation";
import { useExternalNavigation } from "@/hooks/ExternalNavigation/useExternalNavigation";

const DesktopNav = () => {
  const { handleExternalClick } = useExternalNavigation(
    "https://minifig-designer.onrender.com"
  );

  return (
    <ul className="hidden md:flex items-center justify-center space-x-12 text-md">
      {navItems.map((item) => (
        <li key={item.id}>
          {item.isExternalLink ? (
            <a
              href="#"
              onClick={(e) => handleExternalClick(e, item)}
              className="text-white hover:text-accent transition-colors duration-200"
              target="_blank"
            >
              {item.label}
            </a>
          ) : (
            // Internal link - use NavLink as before
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-accent font-medium decoration-2 underline underline-offset-8"
                  : "text-white hover:text-accent transition-colors duration-200"
              }
            >
              {item.label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

export default DesktopNav;
