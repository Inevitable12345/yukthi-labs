/**
 * Payment and QR code configuration.
 *
 * ⚠ FINANCIAL DATA — verify every character against the official poster and a
 * bank statement before deploying. Never publish a QR image whose destination
 * has not been scanned and confirmed by the organising committee.
 */

export const bankDetails = {
  accountNumber: "CONTACT ORGANISERS",
  ifsc: "CONTACT ORGANISERS",
  bank: "ICICI Bank",
  branch: "Contact the organising committee",
  /** TODO(assets): confirm the exact account holder name printed on the poster. */
  accountName: undefined as string | undefined,
};

export type QrCode = {
  id: string;
  title: string;
  caption: string;
  /** Path to the approved QR image in /public. */
  image?: string;
  /** The URL the QR resolves to — always shown as a text link for accessibility. */
  href?: string;
  hrefLabel?: string;
};

export const qrCodes: QrCode[] = [
  {
    id: "registration",
    title: "Scan to Register & Submit",
    caption:
      "Scan this code to open the official registration and paper submission form.",
    image: undefined, // TODO(assets): /qr/registration.png
    href: undefined, // TODO(assets): official registration URL
    hrefLabel: "Open the registration form",
  },
  {
    id: "payment",
    title: "Scan to Pay",
    caption:
      "Scan this code to pay the registration fee for your delegate category.",
    image: undefined, // TODO(assets): /qr/payment.png
    href: undefined,
    hrefLabel: "Open payment details",
  },
];

export const paymentWarning =
  "Confirm the account number, IFSC code and recipient name with the organising committee before making any payment. Do not share transaction OTPs, card details or UPI PINs with anyone.";

/**
 * Payment-proof upload is deliberately not implemented. Enable it only when an
 * official workflow (endpoint, storage and privacy notice) has been provided.
 */
export const paymentProofWorkflowEnabled = false;
