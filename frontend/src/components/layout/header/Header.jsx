import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, Search, ShoppingCart, Menu } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/wof_logo.png";
import SearchSheet from "./SearchSheet";
import CartSheet from "./CartSheet";
import DesktopNavbar from "./components/DesktopNavbar";
import MobileMenu from "./components/MobileMenu";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { cartItems = [], externalItems = [] } = useSelector(
    (state) => state.cart
  );
  const totalItems = cartItems.length + externalItems.length;

  const headerActions = [
    {
      id: "search",
      icon: <Search size={24} />,
      component: (
        <SearchSheet
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ),
    },
    {
      id: "cart",
      icon: (
        <>
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 text-xs rounded-full h-4 w-4 flex items-center justify-center bg-accent text-foreground">
            {totalItems}
          </span>
        </>
      ),
      component: <CartSheet />,
    },
    {
      id: "user",
      className: "hidden md:flex",
      content: user ? (
        <UserDropdown />
      ) : (
        <NavLink to="/login">
          <User size={24} />
        </NavLink>
      ),
      isStandalone: true,
    },
    {
      id: "menu",
      icon: <Menu size={24} />,
      component: <MobileMenu user={user} />,
      className: "md:hidden",
    },
  ];

  const renderAction = ({
    id,
    icon,
    component,
    className,
    content,
    isStandalone,
  }) => (
    <div key={id} className={`flex items-center justify-center ${className}`}>
      {isStandalone ? (
        content
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <div className="cursor-pointer relative">{icon}</div>
          </SheetTrigger>
          {component}
        </Sheet>
      )}
    </div>
  );

  return (
    <nav className="bg-brand-start fixed w-full top-0 z-50 border-b border-brand-end/50">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between h-[85px] p-5">
          <div className="flex items-center">
            <NavLink to="/">
              <img className="h-20" src={logo} alt="logo" />
            </NavLink>
          </div>
          <div className="flex-grow flex justify-center">
            <DesktopNavbar />
          </div>
          <div className="flex items-center gap-5">
            {headerActions.map(renderAction)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
