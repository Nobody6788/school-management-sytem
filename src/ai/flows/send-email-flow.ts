'use server';
/**
 * @fileOverview A flow for sending emails.
 *
 * - sendEmail - A function that simulates sending an email.
 * - EmailInput - The input type for the sendEmail function.
 * - EmailOutput - The return type for the sendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EmailInputSchema = z.object({
  to: z.string().email().describe('The email address of the recipient.'),
  subject: z.string().describe('The subject of the email.'),
  body: z.string().describe('The content of the email.'),
});
export type EmailInput = z.infer<typeof EmailInputSchema>;

const EmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  message: z.string().describe('A confirmation message.'),
});
export type EmailOutput = z.infer<typeof EmailOutputSchema>;

export async function sendEmail(input: EmailInput): Promise<EmailOutput> {
  return sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: EmailInputSchema,
    outputSchema: EmailOutputSchema,
  },
  async (input) => {
    console.log('--- SIMULATING EMAIL ---');
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(`Body:\n${input.body}`);
    console.log('--- EMAIL SENT ---');

    // In a real application, you would integrate with an email service like SendGrid, Resend, etc. here.
    
    return {
      success: true,
      message: `Email successfully sent to ${input.to}`,
    };
  }
);
