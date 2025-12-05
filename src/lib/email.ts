// Client-side email sending via API route
export const sendEmail = async (type: string, bookingData: any) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        bookingData
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to send email: ${error.error}`);
    }

    const result = await response.json();
    return result;
    
  } catch (error) {
    throw error;
  }
};
