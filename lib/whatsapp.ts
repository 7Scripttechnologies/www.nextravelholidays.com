const WHATSAPP_NUMBER = "918866486477";

const INQUIRY_MESSAGE =
  "Hi NexTravel, I would like to inquire about your holiday packages. Please share more details.";

const PACKAGE_MESSAGE =
  "Hi NexTravel, I would like to get a holiday package. Please share the available options and details.";

export interface BookingInquiry {
  packageName: string;
  name: string;
  whatsapp: string;
  date: string;
  travelers: string;
  notes: string;
}

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatTravelDate(value: string) {
  if (!value) return "Not specified";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

export function buildBookingWhatsAppUrl(data: BookingInquiry) {
  const notes = data.notes.trim() || "None";

  const message = [
    "Hi NexTravel, I want to book a trip.",
    "",
    "*I Got your Refrance From Your Website*",
    "",
    `Package: ${data.packageName}`,
    `Name: ${data.name}`,
    `WhatsApp Number: ${data.whatsapp}`,
    `Travel Date: ${formatTravelDate(data.date)}`,
    `Travelers: ${data.travelers}`,
    `Special Requests: ${notes}`,
  ].join("\n");

  return whatsappUrl(message);
}

export interface ContactInquiry {
  name: string;
  whatsapp: string;
  email: string;
  subject: string;
  message: string;
}

export function buildContactWhatsAppUrl(data: ContactInquiry) {
  const message = [
    "Hi NexTravel, I want to get in touch.",
    "",
    "*I Got your Refrance From Your Website*",
    "",
    `Name: ${data.name}`,
    `WhatsApp Number: ${data.whatsapp}`,
    `Email: ${data.email || "Not shared"}`,
    `Subject: ${data.subject}`,
    `Message: ${data.message}`,
  ].join("\n");

  return whatsappUrl(message);
}

const CONSULTANT_MESSAGE =
  "Hi NexTravel, I would like a free consultation for my dream trip. Please help me plan the itinerary.";

export const whatsappInquiryUrl = whatsappUrl(INQUIRY_MESSAGE);
export const whatsappPackageUrl = whatsappUrl(PACKAGE_MESSAGE);
export const whatsappConsultantUrl = whatsappUrl(
  [
    CONSULTANT_MESSAGE,
    "",
    "*I Got your Refrance From Your Website*",
  ].join("\n"),
);
