// Client-side email sending using Resend API directly
export const sendEmail = async (type: string, bookingData: any) => {
  const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key not found');
  }

  let emailData;
  
  switch (type) {
    case 'booking_notification':
      emailData = {
        from: 'onboarding@resend.dev',
        to: 'softwareeng@tecgrw.com',
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
        from: 'onboarding@resend.dev',
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
          
          <p>We look forward to welcoming you to our coworking space!</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          The Tecgrw Team</p>
        `,
      };
      break;
      
    case 'booking_rejection':
      emailData = {
        from: 'onboarding@resend.dev',
        to: bookingData.email,
        subject: 'Regarding Your Coworking Space Booking Request',
        html: `
          <h2>Booking Update</h2>
          <p>Dear ${bookingData.name},</p>
          <p>Thank you for your interest in Tecgrw Coworking Space.</p>
          
          <p>Unfortunately, we're unable to accommodate your booking request for <strong>${bookingData.date ? new Date(bookingData.date.seconds ? bookingData.date.seconds * 1000 : bookingData.date).toLocaleDateString() : 'the requested date'}</strong> due to availability constraints.</p>
          
          <h3>Alternative Options:</h3>
          <ul>
            <li>Please check our availability for other Wednesdays or Fridays</li>
            <li>Contact us directly to discuss alternative arrangements</li>
            <li>Submit a new booking request for a different date</li>
          </ul>
          
          <p>We apologize for any inconvenience and hope to welcome you soon.</p>
          
          <p>For questions: Phone +250 795 583 795 or Email info@tecgrw.com</p>
          
          <p>Best regards,<br>
          The Tecgrw Team</p>
        `,
      };
      break;
      
    default:
      throw new Error('Invalid email type');
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
    throw new Error(`Failed to send email: ${error}`);
  }

  return await response.json();
};