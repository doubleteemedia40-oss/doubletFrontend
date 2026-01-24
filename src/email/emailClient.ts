import emailjs from '@emailjs/browser';

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const welcomeTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME_ID as string | undefined;
const releaseTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_RELEASE_ID as string | undefined;
const partialTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_PARTIAL_ID as string | undefined;
const resetTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_RESET_ID as string | undefined;

// Helper to check if configuration is present
const isConfigured = Boolean(publicKey && serviceId);

export const sendWelcomeEmail = async (params: { to_email: string; to_name: string }) => {
  if (!isConfigured || !welcomeTemplateId) {
    console.warn("EmailJS configuration missing. Skipping welcome email.");
    return;
  }

  try {
    console.log("Sending welcome email with params:", params);
    if (!params.to_email) {
      console.warn("Welcome email recipient is empty.");
      return;
    }
    // Explicitly pass publicKey in the options object for better reliability
    await emailjs.send(serviceId as string, welcomeTemplateId, params, { publicKey });
    console.log(`Welcome email sent to ${params.to_email}`);
  } catch (error) {
    // Enrich the error with context but rethrow so the store can handle/log it
    console.warn("EmailJS send failed. This is often caused by AdBlockers or network firewalls blocking 'api.emailjs.com'.");
    throw error;
  }
};

export const sendReleaseEmail = async (params: {
  to_email: string;
  to_name: string;
  order_id: string;
  total: string;
  details?: string;
}) => {
  if (!isConfigured || !releaseTemplateId) {
    console.warn("EmailJS configuration missing. Skipping release email.");
    return;
  }

  try {
    await emailjs.send(serviceId as string, releaseTemplateId, params, { publicKey });
    console.log(`Release email sent to ${params.to_email}`);
  } catch (error) {
    console.warn("EmailJS send failed (Release). Check AdBlockers/Firewall.");
    throw error;
  }
};

export const sendPartialEmail = async (params: {
  to_email: string;
  to_name: string;
  order_id: string;
  total: string;
  details?: string;
}) => {
  if (!isConfigured || !partialTemplateId) {
    console.warn("EmailJS configuration missing. Skipping partial email.");
    return;
  }
  try {
    await emailjs.send(serviceId as string, partialTemplateId, params, { publicKey });
    console.log(`Partial delivery email sent to ${params.to_email}`);
  } catch (error) {
    console.warn("EmailJS send failed (Partial). Check AdBlockers/Firewall.");
    throw error;
  }
};

export const sendResetEmail = async (params: {
  to_email: string;
  email: string;
  link: string;
  token: string;
}) => {
  if (!isConfigured || !resetTemplateId) {
    console.warn("EmailJS configuration missing. Skipping reset email.");
    return;
  }
  try {
    await emailjs.send(serviceId as string, resetTemplateId, params, { publicKey });
    console.log(`Reset email sent to ${params.to_email}`);
  } catch (error) {
    console.warn("EmailJS send failed (Reset). Check AdBlockers/Firewall.");
    throw error;
  }
};
