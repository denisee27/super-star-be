import ExcelJS from "exceljs";

const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0041FB" } };
const HEADER_FONT = { color: { argb: "FFFFFFFF" }, bold: true };

const CATEGORY_LABEL = { MCN_AGENCY: "MCN Agency", PASUKAN_AFFILIATE: "Pasukan Affiliate", BRAND_SELLER: "Brand/Seller" };
const STATUS_LABEL = { NEW: "Baru", CONTACTED: "Dihubungi", QUALIFIED: "Qualified", REJECTED: "Ditolak" };

function styleHeader(row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

export async function buildInquiryExcel(inquiries) {
  const workbook = new ExcelJS.Workbook();

  const mcnData   = inquiries.filter((i) => i.category === "MCN_AGENCY");
  const pasData   = inquiries.filter((i) => i.category === "PASUKAN_AFFILIATE");
  const brandData = inquiries.filter((i) => i.category === "BRAND_SELLER");

  // ── Sheet 1: Semua Data (aktif pertama kali dibuka) ──────────────────────
  const allSheet = workbook.addWorksheet("Semua Data");
  allSheet.columns = [
    { header: "No",       width: 5  },
    { header: "Tanggal",  width: 18 },
    { header: "Kategori", width: 20 },
    { header: "Nama / Brand",    width: 25 },
    { header: "Email",           width: 28 },
    { header: "Kontak / Username", width: 22 },
    { header: "Domisili",        width: 18 },
    { header: "Platform",        width: 15 },
    { header: "GMV/Bulan",       width: 18 },
    { header: "Status",          width: 14 },
    { header: "Catatan",         width: 30 },
  ];
  styleHeader(allSheet.getRow(1));
  allSheet.views = [{ state: "frozen", ySplit: 1 }];
  inquiries.forEach((item, idx) => {
    allSheet.addRow([
      idx + 1,
      formatDate(item.createdAt),
      CATEGORY_LABEL[item.category] ?? item.category,
      item.fullName ?? item.brandName ?? "",
      item.email ?? "",
      item.phone ?? item.username ?? item.picContact ?? "",
      item.domicile ?? "",
      item.platform ?? "",
      item.gmvRange ?? "",
      STATUS_LABEL[item.status] ?? item.status,
      item.notes ?? "",
    ]);
  });

  // ── Sheet 2: MCN Agency ───────────────────────────────────────────────────
  const mcnSheet = workbook.addWorksheet("MCN Agency");
  mcnSheet.columns = [
    { header: "No",           width: 5  },
    { header: "Tanggal",      width: 18 },
    { header: "Platform",     width: 15 },
    { header: "Nama Lengkap", width: 25 },
    { header: "Email",        width: 28 },
    { header: "No HP",        width: 16 },
    { header: "Link Akun",    width: 30 },
    { header: "Domisili",     width: 18 },
    { header: "GMV/Bulan",    width: 18 },
    { header: "Followers",    width: 18 },
    { header: "Status",       width: 14 },
    { header: "Catatan",      width: 30 },
  ];
  styleHeader(mcnSheet.getRow(1));
  mcnSheet.views = [{ state: "frozen", ySplit: 1 }];
  mcnData.forEach((item, idx) => {
    mcnSheet.addRow([
      idx + 1,
      formatDate(item.createdAt),
      item.platform ?? "",
      item.fullName ?? "",
      item.email ?? "",
      item.phone ?? "",
      item.accountLink ?? "",
      item.domicile ?? "",
      item.gmvRange ?? "",
      item.followersRange ?? "",
      STATUS_LABEL[item.status] ?? item.status,
      item.notes ?? "",
    ]);
  });

  // ── Sheet 3: Pasukan Affiliate ────────────────────────────────────────────
  const pasSheet = workbook.addWorksheet("Pasukan Affiliate");
  pasSheet.columns = [
    { header: "No",        width: 5  },
    { header: "Tanggal",   width: 18 },
    { header: "Nama",      width: 25 },
    { header: "Email",     width: 28 },
    { header: "Username",  width: 22 },
    { header: "GMV/Bulan", width: 18 },
    { header: "Domisili",  width: 18 },
    { header: "Status",    width: 14 },
    { header: "Catatan",   width: 30 },
  ];
  styleHeader(pasSheet.getRow(1));
  pasSheet.views = [{ state: "frozen", ySplit: 1 }];
  pasData.forEach((item, idx) => {
    pasSheet.addRow([
      idx + 1,
      formatDate(item.createdAt),
      item.fullName ?? "",
      item.email ?? "",
      item.username ?? "",
      item.gmvRange ?? "",
      item.domicile ?? "",
      STATUS_LABEL[item.status] ?? item.status,
      item.notes ?? "",
    ]);
  });

  // ── Sheet 4: Brand Seller ─────────────────────────────────────────────────
  const brandSheet = workbook.addWorksheet("Brand Seller");
  brandSheet.columns = [
    { header: "No",              width: 5  },
    { header: "Tanggal",         width: 18 },
    { header: "Nama Brand",      width: 25 },
    { header: "Email",           width: 28 },
    { header: "Link Toko",       width: 30 },
    { header: "Kategori Produk", width: 22 },
    { header: "Nama PIC",        width: 22 },
    { header: "Role PIC",        width: 18 },
    { header: "Kontak PIC",      width: 18 },
    { header: "Status",          width: 14 },
    { header: "Catatan",         width: 30 },
  ];
  styleHeader(brandSheet.getRow(1));
  brandSheet.views = [{ state: "frozen", ySplit: 1 }];
  brandData.forEach((item, idx) => {
    brandSheet.addRow([
      idx + 1,
      formatDate(item.createdAt),
      item.brandName ?? "",
      item.email ?? "",
      item.storeLink ?? "",
      item.productCategory ?? "",
      item.picName ?? "",
      item.picRole ?? "",
      item.picContact ?? "",
      STATUS_LABEL[item.status] ?? item.status,
      item.notes ?? "",
    ]);
  });

  return workbook.xlsx.writeBuffer();
}
