/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useLazyLogoutQuery } from "@/redux/api/authApi";
import { useExternalNavigation } from "@/hooks/ExternalNavigation/useExternalNavigation";
import { User, LogOut, ArrowRight } from "lucide-react";
import {
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import { navItems, userMenuItems } from "@/constant/navigation";

// Wrapper component for sheet closing behavior
const SheetCloseWrapper = ({ children, ...props }) => (
  <SheetClose asChild {...props}>
    {children}
  </SheetClose>
);

// Shared Navigation Item Component
const NavigationItem = ({ to, icon, label, isActive, isExternalLink }) => {
  const { handleExternalClick } = useExternalNavigation(
    "https://minifig-designer.onrender.com"
  );

  return (
    <SheetCloseWrapper>
      {isExternalLink ? (
        <a
          href="#"
          onClick={handleExternalClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 w-full text-background hover:bg-brand-dark/50 hover:text-accent`}
          target="_blank"
        >
          {icon}
          <span className="flex-1 text-left">{label}</span>
        </a>
      ) : (
        <NavLink
          to={to}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 w-full ${
            isActive
              ? "bg-accent text-foreground font-medium"
              : "text-background hover:bg-brand-dark/50 hover:text-accent"
          }`}
        >
          {icon}
          <span className="flex-1 text-left">{label}</span>
        </NavLink>
      )}
    </SheetCloseWrapper>
  );
};

// Shared Button Component for bottom section
const ActionButton = ({ variant, icon, label, onClick }) => (
  <SheetCloseWrapper>
    <Button
      variant={variant}
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
    >
      <span>{label}</span>
      {icon}
    </Button>
  </SheetCloseWrapper>
);

const MobileMenu = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logout, { data, isError, error, isSuccess }] = useLazyLogoutQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "An error occurred during logout");
    }
    if (isSuccess) {
      toast.success(data?.message || "Logout successful", {
        autoClose: 1000,
        onClose: () => navigate(0),
      });
    }
  }, [isError, error, isSuccess, data, navigate]);

  // Filter user menu items based on user role
  const filteredUserMenuItems = user
    ? userMenuItems.filter(
        (item) =>
          !item.roleRequired ||
          (Array.isArray(item.roleRequired) &&
            item.roleRequired.includes(user.role))
      )
    : [];

  // Add helper function to check active state
  const isActive = (path) => {
    const basePath = path.split("?")[0]; // Remove query parameters
    const currentPath = location.pathname;
    return currentPath.startsWith(basePath);
  };

  // user profile or sign in card
  const renderUserSection = () => (
    <Card className="flex items-center gap-3 mb-5 p-5">
      {user ? (
        <>
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            {user?.profile_picture?.url ? (
              <img
                src={user.profile_picture.url}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-accent flex items-center justify-center text-foreground text-lg font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg text-background font-medium line-clamp-1">
              {user.name}
            </p>
            <p className="text-sm text-gray-300 line-clamp-1">{user.email}</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center">
            <User size={24} className="text-accent" />
          </div>
          <SheetCloseWrapper>
            <NavLink
              to="/login"
              className="flex items-center justify-between flex-1 text-background group hover:text-accent"
            >
              <span className="font-medium">Sign In</span>
              <ArrowRight size={20} className="group-hover:text-accent" />
            </NavLink>
          </SheetCloseWrapper>
        </>
      )}
    </Card>
  );

  // Public Navigation Links
  const renderNavLinks = () => (
    <div className="space-y-2">
      {navItems.map((item) => (
        <NavigationItem
          key={item.id}
          to={item.path}
          icon={<item.icon size={20} />}
          label={item.label}
          isActive={location.pathname === item.path}
          isExternalLink={item.isExternalLink}
        />
      ))}
    </div>
  );

  // User Menu Items when user is logged in
  const renderUserMenuItems = () =>
    user &&
    filteredUserMenuItems.length > 0 && (
      <>
        <div className="my-3 border-t border-brand-end/50" />
        <div className="space-y-2">
          {filteredUserMenuItems.map((item) => (
            <NavigationItem
              key={item.id}
              to={item.path}
              icon={<item.icon size={20} />}
              label={item.label}
              isActive={isActive(item.path)}
            />
          ))}
        </div>
      </>
    );

  // Bottom section with shared button component
  const renderBottomSection = () => (
    <div className="p-3 border-t border-brand-end/50 mt-auto">
      {user ? (
        <ActionButton
          variant="destructive"
          icon={<LogOut size={20} />}
          label="Logout"
          onClick={() => logout()}
        />
      ) : (
        <ActionButton
          variant="accent"
          icon={<ArrowRight size={20} />}
          label="Create Account"
          onClick={() => navigate("/register")}
        />
      )}
    </div>
  );

  return (
    <SheetContent>
      <SheetHeader className="sr-only">
        <SheetTitle>Mobile Menu</SheetTitle>
        <SheetDescription>
          This is the mobile menu. It is used to navigate the website on a
          mobile device.
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col h-full">
        <div className="px-5 pt-16">{renderUserSection()}</div>
        <nav className="px-5 flex-1">
          {renderNavLinks()}
          {renderUserMenuItems()}
        </nav>
        {renderBottomSection()}
      </div>
    </SheetContent>
  );
};

export default MobileMenu;
