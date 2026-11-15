import { renderToString } from "react-dom/server";
import { App } from "./App";
import { BrandMonogram } from "./components/BrandMonogram";
export { business, topics } from "./content";

export function render() {
  return renderToString(<App />);
}

export function renderNotFound() {
  return renderToString(
    <main className="not-found wrap">
      <BrandMonogram />
      <h1>That page isn’t here.</h1>
      <p>Return to Navodhai to enquire about blouse making, dress making and customisation.</p>
      <a className="action" href="/">
        Back to Navodhai
      </a>
    </main>,
  );
}
