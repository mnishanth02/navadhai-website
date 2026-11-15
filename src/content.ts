export const business = {
  name: "Navodhai",
  tagline: "Be a princess.",
  phone: "+91 78459 52592",
  phoneHref: "tel:+917845952592",
  whatsappNumber: "917845952592",
  email: "manjulajayanthi1@gmail.com",
  serviceArea: "Coimbatore, Tamil Nadu",
} as const;

export const topics = [
  {
    id: "blouse",
    name: "Blouse making",
    subject: "blouse making",
  },
  {
    id: "dress",
    name: "Dress making",
    subject: "dress making",
  },
  {
    id: "customisation",
    name: "Customisation",
    subject: "customisation",
  },
] as const;

export type Topic = (typeof topics)[number];
export type TopicId = Topic["id"];

export function enquiryMessage(topic: Topic): string {
  return `Hi Navodhai, I'd like to enquire about ${topic.subject}. Can we discuss my requirements?`;
}

export function whatsappHref(message: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const generalEnquiryHref = whatsappHref("Hi Navodhai, I'd like to discuss an enquiry.");

export const ideaNotes = [
  {
    title: "Blouse making",
    description:
      "Have a blouse in mind? Share your idea or reference and discuss the details with us online.",
  },
  {
    title: "Dress making",
    description:
      "Tell us about the dress you’re considering. We’ll talk through your requirements before you place an order.",
  },
  {
    title: "Customisation",
    description:
      "Have a change in mind? Share what you would like to customise so we can discuss what’s possible.",
  },
] as const;

export const orderingSteps = [
  {
    title: "Share your idea.",
    description:
      "Start on WhatsApp with the piece you have in mind. You can include a reference and any requirements you already have.",
  },
  {
    title: "Discuss the details.",
    description:
      "Talk through your requirements and measurements online. If a visit would help, arrange one with us in Coimbatore.",
  },
  {
    title: "Agree on the next step.",
    description:
      "Discuss the details with us before placing your order. Visits are optional; the conversation can begin online.",
  },
] as const;
