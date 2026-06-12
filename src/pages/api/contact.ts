import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    
    // Extract fields
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const projectType = data.get('projectType') as string;
    const message = data.get('message') as string;
    const botcheck = data.get('_botcheck') as string;

    // Honeypot validation
    if (botcheck) {
      return new Response(JSON.stringify({ error: 'Spam detected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Required fields validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(resendApiKey);

    const emailResponse = await resend.emails.send({
      // You can only send FROM onboarding@resend.dev until you verify a domain in Resend
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'bhuvaneshchinthala0@gmail.com',
      replyTo: email,
      subject: `New Project Inquiry from ${name} (${projectType || 'General'})`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested In:</strong> ${projectType || 'Not specified'}</p>
        <p><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
        <hr />
        <h3>Project Description:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      return new Response(JSON.stringify({ error: emailResponse.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
