import { orderingSteps } from "../content";

export function OrderingSection() {
  return (
    <section className="ordering-section wrap" aria-labelledby="ordering-title">
      <div className="ordering-intro">
        <h2 id="ordering-title">Start with a conversation.</h2>
        <p>Enquire online. Visit by arrangement.</p>
      </div>
      <ol className="ordering-steps">
        {orderingSteps.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
