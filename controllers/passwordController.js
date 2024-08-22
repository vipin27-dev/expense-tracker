require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Sendinblue
const sendinblueClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = sendinblueClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY; // Your Sendinblue API Key

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Forgot password function
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Send dummy email
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
            to: [{ email }],
            sender: { email: 'vipinlamba.2706@gmail.com' },
            subject: 'Password Reset Request',
            htmlContent: '<h1>Reset Your Password</h1><p>Click <a href="#">here</a> to reset your password.</p>',
        });

        await emailApi.sendTransacEmail(sendSmtpEmail);

        res.status(200).json({ message: 'Password reset email sent if the address is registered.' });
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        res.status(500).json({ message: 'Failed to send reset email.' });
    }
};
