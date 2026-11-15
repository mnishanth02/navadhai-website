import { ideaNotes } from "../content";
import pattern from "../assets/idea-illustrations/pattern.webp";
import seam from "../assets/idea-illustrations/seam.webp";
import reference from "../assets/idea-illustrations/reference.webp";

const illustrations = [pattern, seam, reference];

export function IdeaSection() {
  return (
    <section className="idea-section" id="services" aria-labelledby="idea-title">
      <div className="idea-layout wrap">
        <div className="idea-intro">
          <h2 id="idea-title">Made around your idea.</h2>
          <p>
            Blouse making, dress making and customisation enquiries in Coimbatore, Tamil Nadu. Start
            online with your idea or reference.
          </p>
        </div>
        <dl className="idea-notes">
          {ideaNotes.map((note, index) => (
            <div key={note.title}>
              <dt>
                <span>{note.title}</span>
                <img
                  className="idea-note-illustration"
                  src={illustrations[index]}
                  width={192}
                  height={192}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </dt>
              <dd>{note.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
