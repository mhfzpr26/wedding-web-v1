/**
 * =======================================================================
 * INVATERA - GOOGLE APPS SCRIPT BACKEND (GOOGLE SHEETS INTEGRATION)
 * =======================================================================
 * Petunjuk Penggunaan untuk Admin:
 * 1. Buat Google Sheet baru di Google Drive Anda (Contoh: "RSVP - Kevin & Sarah").
 * 2. Baris pertama (Header) di Sheet1:
 *    A1: Timestamp | B1: Nama Tamu | C1: Kehadiran | D1: Jumlah Tamu | E1: Ucapan & Doa
 * 3. Buka menu Extensions (Ekstensi) > Apps Script.
 * 4. Hapus semua kode default dan PASTE seluruh isi file ini.
 * 5. Klik "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 6. Pilih Type: "Web app".
 *    - Description: "RSVP Backend v1"
 *    - Execute as: "Me (email anda)"
 *    - Who has access: "Anyone" (Siapa saja, TANPA login Google)
 * 7. Salin Web App URL yang dihasilkan (contoh: https://script.google.com/macros/s/AKfycb.../exec)
 * 8. Tempelkan URL tersebut ke file `src/config/weddingConfig.js` pada bagian `integration.googleAppsScriptUrl`.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Sheet1") || doc.getSheets()[0];

    // Buat header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Nama Tamu", "Kehadiran", "Jumlah Tamu", "Ucapan & Doa"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#132238").setFontColor("#FFFFFF");
    }

    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var timestamp = new Date();
    var name = data.name || "Tamu Undangan";
    var attendance = data.attendance === "hadir" ? "Hadir" : "Tidak Hadir";
    var guestsCount = data.guestsCount || 1;
    var message = data.message || "-";

    sheet.appendRow([timestamp, name, attendance, guestsCount, message]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "RSVP berhasil disimpan.",
      data: {
        name: name,
        attendance: data.attendance,
        guestsCount: guestsCount,
        message: message,
        timestamp: "Baru saja"
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Sheet1") || doc.getSheets()[0];
    var rows = sheet.getDataRange().getValues();

    var wishes = [];
    // Lewati baris 0 (header)
    for (var i = rows.length - 1; i >= 1; i--) {
      var row = rows[i];
      if (row[1]) { // jika nama ada
        wishes.push({
          id: "sheet-" + i,
          timestamp: row[0] ? Utilities.formatDate(new Date(row[0]), "Asia/Jakarta", "dd MMM yyyy, HH:mm") + " WIB" : "Baru saja",
          name: row[1],
          attendance: row[2] === "Hadir" ? "hadir" : "tidak_hadir",
          guestsCount: row[3],
          message: row[4]
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      wishes: wishes
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      wishes: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
