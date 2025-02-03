import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export default async function sendEmail(from: string, to: string, subject: string, text: string) {
    const msg = {
        to,
        from,
        subject,
        text
    }
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.log(error);
    }
}