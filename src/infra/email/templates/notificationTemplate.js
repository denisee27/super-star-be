const PLATFORM_LABEL = { TIKTOK_SHOP: "TikTok Shop by Tokopedia", SHOPEE: "Shopee" };

function baseLayout({ preheader, headerBg = "#0041FB", body, ctaButton = "" }) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Superstar Agency</title>
</head>
<body style="margin:0;padding:0;background:#F4F6FB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:${headerBg};padding:28px 40px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">SUPERSTAR AGENCY</p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 0;">${body}</td>
          </tr>

          ${ctaButton ? `<tr><td style="padding:28px 40px 0;" align="center">${ctaButton}</td></tr>` : ""}

          <tr>
            <td style="padding:32px 40px 0;">
              <div style="border-top:1px solid #E2E8F0;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                Email ini dikirim secara otomatis. Mohon jangan membalas email ini.
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

function dataRow(label, value) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#9CA3AF;width:160px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:#0A0A0A;font-weight:500;vertical-align:top;">${value}</td>
  </tr>`;
}

function ctaBtn(href, label, color = "#25D366") {
  return `<a href="${href}" target="_blank" style="display:inline-block;background:${color};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:8px;">${label}</a>`;
}

export function mcnNotificationHtml({ fullName, email, platform, domicile, gmvRange, followersRange }) {
  const platformLabel = PLATFORM_LABEL[platform] ?? platform;
  const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0A0A0A;">Pendaftaran Kamu Diterima</p>
    <p style="margin:0 0 28px;font-size:15px;color:#474747;line-height:1.7;">
      Hai <strong>${fullName}</strong>, terima kasih sudah mendaftar sebagai kreator MCN ${platformLabel} di Superstar Agency.
      Tim kami sedang meninjau data kamu dan akan menghubungi kamu dalam <strong>1&ndash;3 hari kerja</strong>.
    </p>

    <div style="background:#F4F6FB;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;">Ringkasan Pendaftaran</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${dataRow("Platform", platformLabel)}
        ${dataRow("Nama", fullName)}
        ${dataRow("Email", email)}
        ${dataRow("Domisili", domicile)}
        ${dataRow("GMV rata-rata", gmvRange)}
        ${dataRow("Jumlah followers", followersRange)}
      </table>
    </div>

    <p style="margin:0 0 32px;font-size:14px;color:#474747;line-height:1.7;">
      Sambil menunggu, pastikan akun media sosial kamu aktif dan konten kamu konsisten.
      Jika ada pertanyaan, kamu bisa menghubungi tim kami melalui halaman utama website.
    </p>`;

  return baseLayout({ preheader: `Pendaftaran MCN ${platformLabel} kamu telah diterima.`, body });
}

export function pasNotificationHtml({ fullName, email, username, domicile, gmvRange, groupLink }) {
  const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0A0A0A;">Kamu Masuk Radar Kami!</p>
    <p style="margin:0 0 28px;font-size:15px;color:#474747;line-height:1.7;">
      Hai <strong>${fullName}</strong>, pendaftaran kamu sebagai Pasukan Affiliate Superstar sudah kami terima.
      Langkah selanjutnya adalah bergabung ke grup WhatsApp komunitas kami untuk mendapatkan update dan materi terbaru.
    </p>

    <div style="background:#F4F6FB;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;">Ringkasan Pendaftaran</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${dataRow("Nama", fullName)}
        ${dataRow("Email", email)}
        ${dataRow("Username", username)}
        ${dataRow("Domisili", domicile)}
        ${dataRow("GMV per bulan", gmvRange)}
      </table>
    </div>`;

  const cta = groupLink ? ctaBtn(groupLink, "Bergabung ke Grup WhatsApp PAS") : "";

  return baseLayout({ preheader: "Selamat bergabung di Pasukan Affiliate Superstar!", body, ctaButton: cta });
}

export function brandNotificationHtml({ picName, brandName, email, productCategory, picRole, waUrl }) {
  const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0A0A0A;">Inquiry Kamu Sudah Kami Terima</p>
    <p style="margin:0 0 28px;font-size:15px;color:#474747;line-height:1.7;">
      Hai <strong>${picName}</strong>, terima kasih atas ketertarikan <strong>${brandName}</strong> untuk berkolaborasi dengan Superstar Agency.
      Tim Business Development kami akan segera menghubungi kamu untuk membahas detail kerja sama lebih lanjut.
    </p>

    <div style="background:#F4F6FB;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;">Ringkasan Inquiry</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${dataRow("Nama Brand", brandName)}
        ${dataRow("Kategori Produk", productCategory)}
        ${dataRow("Nama PIC", picName)}
        ${dataRow("Role", picRole)}
        ${dataRow("Email", email)}
      </table>
    </div>

    <p style="margin:0 0 32px;font-size:14px;color:#474747;line-height:1.7;">
      Ingin langsung berdiskusi? Hubungi tim BD kami sekarang melalui WhatsApp.
    </p>`;

  const cta = waUrl ? ctaBtn(waUrl, "Hubungi Tim BD via WhatsApp") : "";

  return baseLayout({ preheader: `Inquiry dari ${brandName} sudah diterima tim Superstar Agency.`, body, ctaButton: cta });
}
