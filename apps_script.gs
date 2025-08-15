// Apps Script backend to append waitlist submissions into Google Sheets
const SHEET_ID   = 'REPLACE_WITH_YOUR_SHEET_ID'; // Spreadsheet ID (/d/.../edit)
const SHEET_NAME = 'Waitlist'; // Sheet tab name

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Sheet tab not found: ' + SHEET_NAME);

    const p = e.parameter || {};
    // Simple bot trap (honeypot)
    if ((p.company || '').trim() !== '') {
      return HtmlService.createHtmlOutput('OK'); // silently ignore
    }

    sheet.appendRow([
      new Date(),
      (p.name  || '').trim(),
      (p.email || '').trim(),
      (p.note  || '').trim(),
      (p.utm   || '').trim()
    ]);

    const html = HtmlService.createHtmlOutput(
      '<!doctype html><meta charset="utf-8">' +
      '<style>body{font-family:sans-serif;display:grid;place-items:center;height:100vh}</style>' +
      '<h1>Submitted!</h1><p>Thanks for joining the waitlist.</p>'
    );
    return html;
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<!doctype html><meta charset="utf-8"><h1>Error</h1><p>' +
      err.message + '</p>'
    );
  }
}
