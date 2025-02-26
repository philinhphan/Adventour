import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollToTop component, scrolls the window to the top whenever the pathname changes.

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [pathname]);

  return null; // This component does not render anything
};

export default ScrollToTop;
