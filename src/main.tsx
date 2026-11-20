import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/caveat/wght.css";
import App from "./app/App.tsx";
import { slotHash, slotIndexFromHash, timeSlots } from "./app/day";
import "./styles/index.css";

// One page: paths from earlier versions of the site (/experience, /contact, …) open the Poster
// that now holds their content, and anything else lands on the Switcher.
const path = window.location.pathname;
if (path !== "/") {
  const index = slotIndexFromHash(path);
  window.history.replaceState(null, "", index >= 0 ? `/#${slotHash(timeSlots[index])}` : `/${window.location.hash}`);
}

createRoot(document.getElementById("root")!).render(<App />);
