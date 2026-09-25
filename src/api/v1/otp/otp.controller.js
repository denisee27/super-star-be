export function makeOtpController({ otpService }) {
  async function send(req, res, next) {
    try {
      const { email } = req.body;
      await otpService.sendOtp(email);
      res.json({ success: true, data: { message: "Kode OTP telah dikirim ke email kamu." } });
    } catch (error) {
      next(error);
    }
  }

  async function verify(req, res, next) {
    try {
      const { email, code } = req.body;
      await otpService.verifyOtp(email, code);
      res.json({ success: true, data: { verified: true } });
    } catch (error) {
      next(error);
    }
  }

  return { send, verify };
}
