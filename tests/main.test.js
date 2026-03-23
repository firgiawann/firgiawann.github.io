/**
 * @jest-environment jsdom
 *
 * Tests for js/main.js
 * Covers: escapeMd(), sendToTelegram()
 */

// ── DOM setup (must happen before requiring main.js) ────────────────────────
document.body.innerHTML = `
  <body>
    <div id="messageFormBox" style="display: none;"></div>
    <input  id="senderName" type="text" />
    <textarea id="senderMsg"></textarea>
    <span id="currentAgeValue"></span>
    <span id="currentAgeTextValue"></span>
    <span id="dynamicPhaseAge"></span>
    <div id="matrixModal" style="display:none; opacity:0;"></div>
    <div id="matrixModalCard" style="transform: scale(1) translateY(0);"></div>
    <i id="themeIcon" class="fa-sun"></i>
  </body>
`;

// ── Global mocks ─────────────────────────────────────────────────────────────
global.fetch = jest.fn();
global.alert = jest.fn();
global.console.error = jest.fn();

// ── Load module ──────────────────────────────────────────────────────────────
const { escapeMd, sendToTelegram, toggleMessageForm } = require('../js/main.js');

// ── Helpers ───────────────────────────────────────────────────────────────────
function setMessageFormValues(name = 'Awan', msg = 'Halo!') {
  document.getElementById('senderName').value = name;
  document.getElementById('senderMsg').value = msg;
}

function mockFetch(ipResult, telegramResult) {
  global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(ipResult) });
  if (telegramResult instanceof Error) {
    global.fetch.mockRejectedValueOnce(telegramResult);
  } else {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(telegramResult) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
describe('escapeMd', () => {
  test('escapes backslashes', () => {
    expect(escapeMd('a\\b')).toBe('a\\\\b');
  });

  test('escapes asterisks', () => {
    expect(escapeMd('*bold*')).toBe('\\*bold\\*');
  });

  test('escapes underscores', () => {
    expect(escapeMd('_italic_')).toBe('\\_italic\\_');
  });

  test('escapes backticks', () => {
    expect(escapeMd('`code`')).toBe('\\`code\\`');
  });

  test('escapes opening square brackets', () => {
    expect(escapeMd('[link]')).toBe('\\[link]');
  });

  test('returns empty string unchanged', () => {
    expect(escapeMd('')).toBe('');
  });

  test('converts non-string values to string', () => {
    expect(escapeMd(42)).toBe('42');
  });

  test('leaves plain text unchanged', () => {
    expect(escapeMd('hello world')).toBe('hello world');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('sendToTelegram', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMessageFormValues();
    document.getElementById('messageFormBox').style.display = 'block';
  });

  // ── Validation ──────────────────────────────────────────────────────────────
  test('shows alert and does not fetch when name is empty', () => {
    setMessageFormValues('', 'Halo!');
    sendToTelegram();
    expect(global.alert).toHaveBeenCalledWith('Mohon isi Nama dan Pesan terlebih dahulu!');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows alert and does not fetch when message is empty', () => {
    setMessageFormValues('Awan', '');
    sendToTelegram();
    expect(global.alert).toHaveBeenCalledWith('Mohon isi Nama dan Pesan terlebih dahulu!');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows alert and does not fetch when both fields are empty', () => {
    setMessageFormValues('', '');
    sendToTelegram();
    expect(global.alert).toHaveBeenCalledWith('Mohon isi Nama dan Pesan terlebih dahulu!');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── Happy path ───────────────────────────────────────────────────────────────
  test('sends message successfully with geo data (2 fetch calls)', async () => {
    const geo = { ip: '1.2.3.4', city: 'Makassar', region: 'Sulawesi Selatan', country_name: 'Indonesia', org: 'Telkom' };
    mockFetch(geo, { ok: true });

    await sendToTelegram();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.alert).toHaveBeenCalledWith('✅ Pesan berhasil dikirim!');
  });

  test('clears form fields after successful send', async () => {
    mockFetch(
      { ip: '1.2.3.4', city: 'Makassar', region: 'Sulawesi Selatan', country_name: 'Indonesia', org: 'Telkom' },
      { ok: true }
    );

    await sendToTelegram();

    expect(document.getElementById('senderName').value).toBe('');
    expect(document.getElementById('senderMsg').value).toBe('');
  });

  test('hides message form after successful send', async () => {
    mockFetch(
      { ip: '1.2.3.4', city: 'Makassar', region: 'Sulawesi Selatan', country_name: 'Indonesia', org: 'Telkom' },
      { ok: true }
    );

    await sendToTelegram();

    expect(document.getElementById('messageFormBox').style.display).toBe('none');
  });

  // ── IP lookup failure (graceful fallback) ────────────────────────────────────
  test('sends without geo data when IP lookup network fails (2 fetch calls)', async () => {
    // IP fetch rejects, Telegram succeeds
    global.fetch.mockRejectedValueOnce(new Error('IP lookup failed'));
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ ok: true }) });

    await sendToTelegram();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.alert).toHaveBeenCalledWith('✅ Pesan berhasil dikirim!');
  });

  test('sends without geo data when IP lookup returns invalid JSON (2 fetch calls)', async () => {
    // res.json() rejects, Telegram succeeds
    global.fetch.mockResolvedValueOnce({ json: () => Promise.reject(new Error('invalid json')) });
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ ok: true }) });

    await sendToTelegram();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.alert).toHaveBeenCalledWith('✅ Pesan berhasil dikirim!');
  });

  // ── Telegram failure ─────────────────────────────────────────────────────────
  /**
   * Regression test for the network-error bug:
   * Previously, when the Telegram fetch failed the misplaced .catch() would
   * intercept it (treating it as an IP-lookup failure) and make a second
   * Telegram request — resulting in 3 total fetch calls and still showing
   * the network-error alert.  After the fix, only 2 calls are made.
   */
  test('shows network error and makes exactly 2 fetch calls when Telegram fails (bug regression)', async () => {
    const geo = { ip: '1.2.3.4', city: 'Makassar', region: 'Sulawesi Selatan', country_name: 'Indonesia', org: 'Telkom' };
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(geo) }); // IP lookup OK
    global.fetch.mockRejectedValueOnce(new Error('Network error'));            // Telegram fails

    await sendToTelegram();

    // Must be exactly 2 — NOT 3 as the old buggy code would produce
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.alert).toHaveBeenCalledWith('❌ Terjadi kesalahan jaringan.');
  });

  test('shows network error when both IP lookup and Telegram fail (2 fetch calls)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('IP failed'));
    global.fetch.mockRejectedValueOnce(new Error('Telegram failed'));

    await sendToTelegram();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.alert).toHaveBeenCalledWith('❌ Terjadi kesalahan jaringan.');
  });

  test('shows "gagal" alert when Telegram returns ok:false', async () => {
    const geo = { ip: '1.2.3.4', city: 'Makassar', region: 'Sulawesi Selatan', country_name: 'Indonesia', org: 'Telkom' };
    mockFetch(geo, { ok: false, description: 'Bad Request' });

    await sendToTelegram();

    expect(global.alert).toHaveBeenCalledWith('❌ Gagal mengirim pesan! Silakan coba lagi.');
  });

  // ── Payload checks ───────────────────────────────────────────────────────────
  test('Telegram payload includes sender name in message text', async () => {
    mockFetch(
      { ip: '5.5.5.5', city: 'Jakarta', region: 'DKI Jakarta', country_name: 'Indonesia', org: 'ISP' },
      { ok: true }
    );

    setMessageFormValues('BudiSantoso', 'Test pesan');
    await sendToTelegram();

    const telegramCall = global.fetch.mock.calls[1];
    const body = JSON.parse(telegramCall[1].body);
    expect(body.text).toContain('BudiSantoso');
    expect(body.text).toContain('Test pesan');
    expect(body.parse_mode).toBe('Markdown');
  });

  test('Telegram payload includes "Tidak tersedia" for location when IP lookup fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('IP failed'));
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ ok: true }) });

    await sendToTelegram();

    const telegramCall = global.fetch.mock.calls[1];
    const body = JSON.parse(telegramCall[1].body);
    expect(body.text).toContain('Tidak tersedia');
  });
});
