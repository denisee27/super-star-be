import { sendEmail } from "../../infra/email/emailService.js";
import { otpEmailHtml } from "../../infra/email/templates/otpTemplate.js";
import { ValidationError } from "../errors/httpErrors.js";

const OTP_TTL_MS = 5 * 60 * 1000;   // 5 minutes
const MAX_ATTEMPTS = 5;
const RECENT_WINDOW_MS = 2 * 60 * 60 * 1000; // 2-hour rolling window for cooldown calculation

// Progressive resend cooldowns indexed by number of previous sends (0 = first request, no cooldown)
const RESEND_COOLDOWNS_MS = [0, 60_000, 180_000, 360_000, 600_000];

function getCooldownMs(sendCount) {
  return RESEND_COOLDOWNS_MS[Math.min(sendCount, RESEND_COOLDOWNS_MS.length - 1)];
}

function formatWait(ms) {
  const secs = Math.ceil(ms / 1000);
  if (secs < 60) return `${secs} detik`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return rem > 0 ? `${mins} menit ${rem} detik` : `${mins} menit`;
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function makeOtpService({ otpRepository, logger }) {
  async function sendOtp(email) {
    const sendCount = await otpRepository.countRecentByEmail(email, RECENT_WINDOW_MS);
    const cooldownMs = getCooldownMs(sendCount);

    if (cooldownMs > 0) {
      const latest = await otpRepository.findLatestByEmail(email);
      if (latest) {
        const age = Date.now() - new Date(latest.createdAt).getTime();
        const remaining = cooldownMs - age;
        if (remaining > 0) {
          throw new ValidationError(`Tunggu ${formatWait(remaining)} sebelum meminta kode baru.`);
        }
      }
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await otpRepository.create({ email, code, expiresAt });

    try {
      await sendEmail({
        to: email,
        subject: "Kode Verifikasi Email — Superstar Agency",
        html: otpEmailHtml(code),
      });
    } catch (err) {
      logger.error({ email, err: err.message }, "Failed to send OTP email");
      throw new ValidationError("Gagal mengirim email. Pastikan alamat email benar dan coba lagi.");
    }

    logger.info({ email }, "OTP sent");
  }

  async function verifyOtp(email, code) {
    const record = await otpRepository.findLatestByEmail(email);

    if (!record) throw new ValidationError("Kode tidak ditemukan. Minta kode baru.");
    if (record.usedAt) throw new ValidationError("Kode sudah digunakan. Minta kode baru.");
    if (new Date(record.expiresAt) < new Date()) throw new ValidationError("Kode sudah kedaluwarsa. Minta kode baru.");
    if (record.attempts >= MAX_ATTEMPTS) throw new ValidationError("Terlalu banyak percobaan. Minta kode baru.");

    if (record.code !== code) {
      await otpRepository.incrementAttempts(record.id);
      const remaining = MAX_ATTEMPTS - record.attempts - 1;
      throw new ValidationError(`Kode salah. Sisa ${remaining} percobaan.`);
    }

    await otpRepository.markUsed(record.id);
    logger.info({ email }, "OTP verified");
  }

  return { sendOtp, verifyOtp };
}
