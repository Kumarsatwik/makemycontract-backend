import { Resend } from "resend";
import { emailTemplate } from "../utils/emailTemplate";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const resend = new Resend(RESEND_API_KEY);
export const sendEmail = async (email: string, name: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Congratulations! You're Now a Premium User",
      html: emailTemplate({
        name: name,
        companyName: "Contract Analysis",
      }),
    });
    if (error) {
      return console.error({ error });
    }
  } catch (error) {
    console.error(error);
  }
};
