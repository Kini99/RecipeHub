import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'kinjalmomaya99@gmail.com',
    pass: 'cxqzbrhgatfmmecb',
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error) => {
  if (error) {
    console.error('Error with email configuration:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

export const sendCollaborationInvite = async (
  to: string,
  recipeTitle: string,
  authorName: string,
  recipeId: string
) => {
  
  const mailOptions = {
    from: 'kinjalmomaya99@gmail.com',
    to,
    subject: `Collaboration Invitation: ${recipeTitle}`,
    html: `
      <h2>You've been invited to collaborate!</h2>
      <p>${authorName} has invited you to collaborate on their recipe "${recipeTitle}".</p>
      <p>Click the link below to accept the request:</p>
      <a href="${process.env.FRONTEND_URL}/recipes/${recipeId}/edit">Collaborate</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending collaboration invitation email:', {
      error,
      to,
      recipeTitle,
      authorName,
      recipeId
    });
    throw error;
  }
}; 