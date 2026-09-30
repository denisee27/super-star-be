export function makeOtpController({ otpService }) {
  async function send(req, res, next) {
    try {
      const { phone } = req.body;
      await otpService.sendOtp(phone);
      res.json({ success: true, data: { message: "Kode OTP telah dikirim ke WhatsApp kamu." } });
    } catch (error) {
      next(error);
    }
  }

  async function verify(req, res, next) {
    try {
      const { phone, code } = req.body;
      await otpService.verifyOtp(phone, code);
      res.json({ success: true, data: { verified: true } });
    } catch (error) {
      next(error);
    }
  }

  return { send, verify };
}
