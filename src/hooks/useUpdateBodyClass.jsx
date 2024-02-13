import { useEffect } from "react";

export const useUpdateBodyClass = (pathname) => {
  useEffect(() => {
    switch (pathname) {
      case "/":
        document.body.className = "frontpage";
        break;
      case "/about":
      case "/completeprofile":
      case "/dashboard":
        document.body.className = "greenpage";
        break;
      case "/overview":
      case "/household":
        document.body.className = "bluepage";
        break;
      case "/login":
      case "/register":
        document.body.className = "purplepage";
        break;
      default:
        document.body.className = "";
    }
  }, [pathname]);
};
