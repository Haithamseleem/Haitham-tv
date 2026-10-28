/* Haitham TV - settings. Edit this file to customise the TV. */

// Wikimedia Commons photo helper: 'a/ab/File.jpg' -> 1920px thumbnail URL.
function W(p) { return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + p + '/1920px-' + p.split('/').pop(); }
// dawn -> Fajr, day -> Dhuhr + Asr, dusk -> Maghrib, night -> Isha
function SLOTS(dawn, day, dusk, night) {
  return { fajr: [W(dawn)], dhuhr: [W(day)], asr: [W(day)], maghrib: [W(dusk)], isha: [W(night || dusk)] };
}

window.HAITHAM_CONFIG = {
  appName: 'Haitham TV',

  // Cities: Up/Down no longer switch cities; use the "City" tile in the bottom row.
  // method: 'uae' (Fajr/Isha 18.2), 'egypt' (19.5/17.5), 'mwl' (18/17), 'makkah' (18.5, Isha 90 min).
  // timeZone: IANA zone used to show times. offsets: per-prayer minute tweaks to match local mosques.
  cities: [
    { name: 'Dubai',     nameAr: 'دبي',       lat: 25.2048, lng: 55.2708, timeZone: 'Asia/Dubai', method: 'uae', offsets: { dhuhr: 1, maghrib: 1 } },
    { name: 'Abu Dhabi', nameAr: 'أبوظبي',    lat: 24.4539, lng: 54.3773, timeZone: 'Asia/Dubai', method: 'uae', offsets: { dhuhr: 1, maghrib: 1 } },
    { name: 'Sharjah',   nameAr: 'الشارقة',   lat: 25.3463, lng: 55.4209, timeZone: 'Asia/Dubai', method: 'uae', offsets: { dhuhr: 1, maghrib: 1 } },
    { name: 'Cairo',     nameAr: 'القاهرة',   lat: 30.0444, lng: 31.2357, timeZone: 'Africa/Cairo', method: 'egypt', offsets: {} },
    { name: 'Makkah',    nameAr: 'مكة',       lat: 21.4225, lng: 39.8262, timeZone: 'Asia/Riyadh', method: 'makkah', offsets: {} },
    { name: 'Madinah',   nameAr: 'المدينة',   lat: 24.4672, lng: 39.6112, timeZone: 'Asia/Riyadh', method: 'makkah', offsets: {} },
    { name: 'Riyadh',    nameAr: 'الرياض',    lat: 24.7136, lng: 46.6753, timeZone: 'Asia/Riyadh', method: 'makkah', offsets: {} },
    { name: 'Doha',      nameAr: 'الدوحة',    lat: 25.2854, lng: 51.5310, timeZone: 'Asia/Qatar', method: 'makkah', offsets: {} },
    { name: 'Kuwait',    nameAr: 'الكويت',    lat: 29.3759, lng: 47.9774, timeZone: 'Asia/Kuwait', method: 'mwl', offsets: {} },
    { name: 'Manama',    nameAr: 'المنامة',   lat: 26.2285, lng: 50.5860, timeZone: 'Asia/Bahrain', method: 'makkah', offsets: {} },
    { name: 'Muscat',    nameAr: 'مسقط',      lat: 23.5880, lng: 58.3829, timeZone: 'Asia/Muscat', method: 'mwl', offsets: {} },
    { name: 'Jerusalem', nameAr: 'القدس',     lat: 31.7780, lng: 35.2354, timeZone: 'Asia/Jerusalem', method: 'mwl', offsets: {} },
    { name: 'Petra',     nameAr: 'البتراء',   lat: 30.3285, lng: 35.4444, timeZone: 'Asia/Amman', method: 'mwl', offsets: {} },
    { name: 'Beirut',    nameAr: 'بيروت',     lat: 33.8938, lng: 35.5018, timeZone: 'Asia/Beirut', method: 'mwl', offsets: {} },
    { name: 'Casablanca', nameAr: 'الدار البيضاء', lat: 33.5731, lng: -7.5898, timeZone: 'Africa/Casablanca', method: 'mwl', offsets: {} },
    { name: 'Marrakech', nameAr: 'مراكش',     lat: 31.6295, lng: -7.9811, timeZone: 'Africa/Casablanca', method: 'mwl', offsets: {} }
  ],
  defaultCity: 0,

  // Real city photos for the Top Shelf, keyed by city name. Any https image URL works.
  // Copy the URLs from the old app/js/photos.js here. With no photos, the drawn
  // per-prayer scene is used instead.
  // Optional per-prayer photos: { fajr: [...], dhuhr: [...], asr: [...], maghrib: [...], isha: [...] }
  // Curated from the previous photos.js (credits in CREDITS.md).
  photos: {
    'Dubai': SLOTS('1/1b/Dubai_Skyline_and_Burj_Khalifa_-_25072008.jpg', 'c/cc/Dubai_Skyline_mit_Burj_Khalifa_%2818241030269%29.jpg',
      '9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg', 'c/ca/Dubai_Marina_Towers_by_night.jpg'),
    'Sharjah': SLOTS('1/1b/Dubai_Skyline_and_Burj_Khalifa_-_25072008.jpg', 'c/cc/Dubai_Skyline_mit_Burj_Khalifa_%2818241030269%29.jpg',
      '9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg', 'c/ca/Dubai_Marina_Towers_by_night.jpg'),
    'Abu Dhabi': SLOTS('e/e9/Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815424395673%29.jpg', 'b/bc/Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815856602738%29.jpg',
      '0/0c/Sheikh_Zayed_Grand_Mosque_approach_09.jpg'),
    'Makkah': SLOTS('5/51/Masjid_al-Haram_2022.jpg', 'b/b3/The_Kaaba_during_Hajj_-_edited.jpg',
      '2/22/Kaaba%2C_Masjid_Al-Haram%2C_Mecca%2C_Saudi_Arabia_-_panoramio.jpg', 'c/c1/Masjid_al-Haram%2C_Tawaf_20092012_1130PM_%288008466944%29.jpg'),
    'Madinah': SLOTS('4/4b/Al-Masjid_an_Nabawi.jpg', 'b/bc/Medium_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg',
      'a/a0/Al_Masjid_an_Nabawi_3.jpg'),
    'Jerusalem': SLOTS('a/a3/Jerusalem-2013-Temple_Mount-Dome_of_the_Rock_%26_Chain.jpg', '6/66/Jerusalem-2013-Temple_Mount-Dome_of_the_Rock_%26_Chain_02.jpg',
      '8/8b/Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg'),
    'Doha': SLOTS('8/86/Doha_skyline_in_the_morning_%2812544910974%29.jpg', 'a/a2/Doha_Skyline_01.jpg',
      'a/a5/Doha_Skyline_02.jpg', 'f/f3/Doha_West_Bay_Skyline_Qatar_Jan_2020.jpg'),
    'Riyadh': SLOTS('9/98/Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_%28KAFD%29_and_the_famous_Kingdom_Tower_.jpg',
      '9/98/Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_%28KAFD%29_and_the_famous_Kingdom_Tower_.jpg', '2/20/Riyadh_Skyline.jpg'),
    'Muscat': SLOTS('4/48/Sultan_Qaboos_Grand_Mosque_%2819889998133%29.jpg', '4/41/Muscat%2C_moschea_del_sultano_qaboos%2C_esterno_01.jpg',
      '1/14/Sultan_Qaboos_Grand_Mosque_close_up_view.jpg'),
    'Cairo': SLOTS('d/db/Great_Sphinx_of_Giza_%28%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84%29.jpg', 'a/af/All_Gizah_Pyramids.jpg',
      'e/e7/Giza_Pyramids_during_%22Forever_is_Now%22_exhibition.jpg', 'a/ae/Egypt-2B-004_-_Cairo_at_Night_%282216557315%29.jpg'),
    'Kuwait': SLOTS('d/d9/Kuwait_City_Kuwait_Towers_Panoramic_View_2.jpg', 'e/e3/Kuwait_City_Kuwait_Towers_Panoramic_View_1.jpg',
      '7/7f/Kuwait_City_Kuwait_Towers_Panoramic_View_3.jpg', 'f/f1/Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg'),
    'Manama': SLOTS('5/5c/Manama_Manama_Skyline_13.jpg', '8/82/Manama_Bahrain_Bay_01.jpg',
      '3/37/Manama_Manama_Skyline_14.jpg', 'b/be/Manama_Manama_Skyline_12.jpg'),
    'Petra': SLOTS('4/4e/The_Treasury%2C_Petra%2C_Jordan1.jpg', '0/0b/Al-Khazneh%2C_Petra%2C_Jordan.jpg',
      'e/e8/Al-Khazneh_%28The_Treasury%29%2C_Petra%2C_Jordan.jpg'),
    'Beirut': SLOTS('7/75/Beirut_skyline_view.jpg', 'e/e8/Beirut_skyline%2C_Beirut%2C_Lebanon.jpg',
      'b/bc/Beirut_Skyline_1.jpg', '9/9e/Beirut_Skyline_-_panoramio.jpg'),
    'Casablanca': SLOTS('8/8a/Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber%27s_portfolio.jpg',
      'd/d0/Mezquita_Hassan_II_%28reflejo_en_agua%29.jpg', '0/06/The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg'),
    'Marrakech': SLOTS('f/fc/Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250125_0859_7061.jpg', '1/10/Koutoubia_minaret_from_the_city.JPG',
      '6/61/Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250124_1834_7027.jpg', '0/01/Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250124_1838_7030.jpg')
  },
  photoRotateMinutes: 10,     // change photo every N minutes (crossfade)

  // Apple TV-style app row. appId = Tizen application id, launched with tizen.application.launch.
  // IDs are the ones commonly used on 2022 Samsung TVs; verify on your TV (see README).
  // action: 'today' | 'week' | 'qibla' jumps to that row instead of launching an app.
  apps: [
    { name: 'YouTube',   appId: '111299001912',  color: '#ff0033', glyph: '▶' },
    { name: 'Netflix',   appId: '3201907018807', color: '#000000', glyph: 'N', glyphColor: '#e50914' },
    { name: 'Shahid',    appId: '3201703012079', color: '#0f9d58', glyph: 'شاهد' },
    { name: 'Prime',     appId: '3201910019365', color: '#00a8e1', glyph: 'prime' },
    { name: 'Disney+',   appId: '3201901017640', color: '#0b1b5c', glyph: 'D+' },
    { name: 'Live TV',   appId: 'org.tizen.tv-viewer', color: '#334155', glyph: 'TV' },
    { name: 'Today',     action: 'today', color: '#b7791f', glyph: '☾' },
    { name: 'Weekly',    action: 'week',  color: '#6b46c1', glyph: '7' },
    { name: 'Qibla',     action: 'qibla', color: '#047857', glyph: '۞' }
  ],

  clock24h: false,

  // Azan takeover
  azanTakeover: true,
  azanAudio: '',              // e.g. 'https://example.com/azan.mp3' - empty = silent
  azanTimeoutSec: 120,
  azanFajrAudio: '',          // optional separate Fajr azan

  // Last-minutes warm glow before the next prayer
  glowMinutes: 15,
  glowMax: 0.75,

  // Aerial screensaver after N idle minutes (0 = off)
  screensaverMinutes: 5,

  // Scene rendering
  sceneFps: 30,
  sceneScale: 0.5,            // canvas resolution vs screen (sky is soft, 0.5 is plenty)
  crossfadeMs: 2500,

  // Debug: also enabled with ?debug=1. Fake clock with ?time=2026-10-28T17:55
  // Keys in debug: 1-5 force scene, N = 1 min before next prayer, A = azan now,
  // S = screensaver, G = glow test (10 min before next prayer), 0 = real clock.
  debug: false
};
