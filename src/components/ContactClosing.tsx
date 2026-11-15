import { Mail, Phone } from "lucide-react";
import { business, generalEnquiryHref } from "../content";
import { BrandMonogram } from "./BrandMonogram";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function ContactClosing() {
  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-opening">
          <h2 id="contact-title">Let’s talk.</h2>
          <a
            className="contact-whatsapp"
            href={generalEnquiryHref}
            aria-label="Enquire on WhatsApp"
          >
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </a>
        </div>
        <div className="contact-rail">
          <div className="contact-identity">
            <a className="contact-brand" href="#top" aria-label="Navodhai home">
              <BrandMonogram />
            </a>
            <div>
              <p className="contact-name">{business.name}</p>
              <p className="contact-locality">{business.serviceArea}</p>
            </div>
          </div>
          <address className="contact-channels">
            <a href={business.phoneHref}>
              <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>{business.phone}</span>
            </a>
            <a href={`mailto:${business.email}`}>
              <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>{business.email}</span>
            </a>
          </address>
        </div>
      </div>
    </footer>
  );
}
