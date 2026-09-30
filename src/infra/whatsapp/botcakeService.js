import { env } from "../../config/index.js";

function normalizeToWaPsid(phone) {
  let n = phone.replace(/\s+/g, "").replace(/^\+/, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  if (!n.startsWith("62")) n = "62" + n;
  return `wa_${n}`;
}

export async function sendWhatsappOtp(phone, code) {
  const psid = normalizeToWaPsid(phone);

  console.log("[Botcake] Sending OTP →", { psid, flow_id: env.BOTCAKE_FLOW_ID, payload: { code } });

  const res = await fetch(
    `https://botcake.io/api/public_api/v1/pages/${env.BOTCAKE_PAGE_ID}/flows/send_flow`,
    {
      method: "POST",
      headers: {
        "access-token": env.BOTCAKE_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        psid,
        flow_id: env.BOTCAKE_FLOW_ID,
        payload: { code },
      }),
    }
  );

  const body = await res.json().catch(() => res.text());
  console.log("[Botcake] Response →", res.status, JSON.stringify(body));

  if (!res.ok) {
    throw new Error(`Botcake API error ${res.status}: ${JSON.stringify(body)}`);
  }

  return body;
}
