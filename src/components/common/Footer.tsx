import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

import { Chat, Home, My, Search } from "@/assets/svgs/layouts";

const menuData = [
  {
    name: "홈",
    icon: Home,
    to: "/",
  },
  {
    name: "검색",
    icon: Search,
    to: "/search/category-select",
    activePaths: [
      "/search/category-select",
      "/search/result",
      "/search/category-search",
      "/search/category-result",
      "/search",
    ],
  },
  {
    name: "채팅",
    icon: Chat,
    to: "/chats",
    activePaths: ["/chats"],
  },
  {
    name: "마이",
    icon: My,
    to: "/my",
  },
];

const Footer = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full max-w-[375px] bg-white border-t border-grey04 z-50">
      <div className="flex justify-around items-center h-20">
        {menuData.map(item => {
          const IconComponent = item.icon;

          const isActive =
            location.pathname === item.to ||
            (item.activePaths && item.activePaths.includes(location.pathname));

          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 text-[12px] w-full h-full",
                isActive ? "text-black fill-black" : "text-grey14 fill-grey14"
              )}
            >
              <IconComponent className="w-6 h-6" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
