import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, bookingData } = await request.json();
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Resend API key not found' }, { status: 500 });
    }

    let emailData;
    
    switch (type) {
      case 'booking_notification':
        emailData = {
          from: 'Tecgrw Coworking <noreply@coworkingspace.tecgrw.com>',
          to: 'info@tecgrw.com',
          subject: 'New Coworking Space Booking Request',
          html: `
            <h2>New Coworking Space Booking Request</h2>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
            <p><strong>Number of People:</strong> ${bookingData.people}</p>
            <p><strong>Requested Date:</strong> ${bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Not specified'}</p>
            <hr>
            <p><em>Please review this booking request in your admin panel.</em></p>
            <p><small>Tecgrw Coworking Management System</small></p>
          `,
        };
        break;
        
      case 'booking_acceptance':
        emailData = {
          from: 'Tecgrw Coworking <noreply@coworkingspace.tecgrw.com>',
          to: bookingData.email,
          subject: '🎉 Your Coworking Space Booking is Confirmed!',
          html: `
            <h2>Booking Confirmed!</h2>
            <p>Dear ${bookingData.name},</p>
            <p>Great news! Your coworking space booking has been <strong>confirmed</strong>.</p>
            
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Date:</strong> ${bookingData.date ? new Date(bookingData.date.seconds ? bookingData.date.seconds * 1000 : bookingData.date).toLocaleDateString() : 'Not specified'}</li>
              <li><strong>Number of People:</strong> ${bookingData.people}</li>
              <li><strong>Phone:</strong> ${bookingData.phone}</li>
            </ul>
            
            <h3>Location:</h3>
            <p>Tecgrw Ltd Office<br>
            KG 317, Kibagabaga, Kigali</p>
            
            <h3>What to Bring:</h3>
            <ul>
              <li>Your laptop and work materials</li>
              <li>A positive attitude and readiness to be productive!</li>
            </ul>
            
            <p>We're excited to welcome you to our coworking community!</p>
            
            <p>Best regards,<br>
            <strong>The Tecgrw Team</strong></p>
            
            <hr>
            <p><small>Questions? Reply to this email or call us at +250 795 583 795</small></p>
          `,
        };
        break;
        
      case 'booking_rejection':
        emailData = {
          from: 'Tecgrw Coworking <noreply@coworkingspace.tecgrw.com>',
          to: bookingData.email,
          subject: 'Coworking Space Booking Update',
          html: `
            <h2>Booking Update</h2>
            <p>Dear ${bookingData.name},</p>
            <p>Thank you for your interest in our coworking space.</p>
            
            <p>Unfortunately, we're unable to confirm your booking for the requested date:</p>
            <ul>
              <li><strong>Date:</strong> ${bookingData.date ? new Date(bookingData.date.seconds ? bookingData.date.seconds * 1000 : bookingData.date).toLocaleDateString() : 'Not specified'}</li>
              <li><strong>Number of People:</strong> ${bookingData.people}</li>
            </ul>
            
            <p>This could be due to:</p>
            <ul>
              <li>The date is already fully booked</li>
              <li>The space isn't available on that day</li>
              <li>Capacity limitations</li>
            </ul>
            
            <p><strong>We'd love to help you find an alternative!</strong><br>
            Please contact us to discuss other available dates:</p>
            
            <p>📞 <strong>Call/WhatsApp:</strong> +250 795 583 795 or +250 798 975 878<br>
            📧 <strong>Email:</strong> info@tecgrw.com</p>
            
            <p>Thank you for understanding, and we hope to welcome you soon!</p>
            
            <p>Best regards,<br>
            <strong>The Tecgrw Team</strong></p>
          `,
        };
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: error,
        hasApiKey: !!RESEND_API_KEY,
        apiKeyPrefix: RESEND_API_KEY ? RESEND_API_KEY.substring(0, 8) + '...' : 'none'
      });
      return NextResponse.json({ error: `Failed to send email: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
    
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
