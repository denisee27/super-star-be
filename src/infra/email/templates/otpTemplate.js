export function otpEmailHtml(code) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kode Verifikasi</title>
</head>
<body style="margin:0;padding:0;background:#F4F6FB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0041FB;padding:28px 40px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">SUPERSTAR AGENCY</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0A0A0A;">Verifikasi Email Kamu</p>
              <p style="margin:0 0 32px;font-size:15px;color:#474747;line-height:1.6;">
                Gunakan kode di bawah ini untuk memverifikasi alamat email kamu sebelum mengirim formulir pendaftaran.
              </p>

              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#F4F6FB;border:1px solid #E2E8F0;border-radius:10px;padding:20px 40px;">
                      <p style="margin:0;font-size:40px;font-weight:700;color:#0041FB;letter-spacing:16px;">${code}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#474747;line-height:1.6;">
                Kode ini berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapapun.
              </p>
              <p style="margin:0;font-size:14px;color:#474747;line-height:1.6;">
                Jika kamu tidak merasa melakukan pendaftaran di Superstar Agency, abaikan email ini.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #E2E8F0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                Email ini dikirim secara otomatis oleh sistem Superstar Agency. Mohon jangan membalas email ini.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9CA3AF;">
                &copy; ${new Date().getFullYear()} Superstar Agency. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
