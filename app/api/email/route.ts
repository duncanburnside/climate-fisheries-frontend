import { NextRequest, NextResponse } from 'next/server';

// Placeholder email API route
// TODO: Implement email sending functionality (e.g., using SendGrid, Resend, or similar)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, email, message } = body;

    if (!name || !subject || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, subject, email, message' },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ ... });

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Email would be sent here',
      // In production, don't expose this
      preview: {
        to: process.env.CONTACT_EMAIL || 'contact@example.com',
        from: email,
        subject: subject,
        text: `From: ${name} (${email})\n\n${message}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

