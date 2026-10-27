// Wallpaper manifest. Each city has 4 time-of-day slots: dawn / day / dusk / night.
//
// Placeholder cities use picsum.photos; curated cities below use real free-license images
// (see CREDITS.md). Never ship random web images in a published repo.
(function () {
  var CITIES = [
    ["dubai", "Dubai", "UAE"],
    ["abudhabi", "Abu Dhabi", "UAE"],
    ["mecca", "Mecca", "Saudi Arabia"],
    ["medina", "Medina", "Saudi Arabia"],
    ["jerusalem", "Jerusalem", "Palestine"],
    ["doha", "Doha", "Qatar"],
    ["riyadh", "Riyadh", "Saudi Arabia"],
    ["kuwait", "Kuwait City", "Kuwait"],
    ["manama", "Manama", "Bahrain"],
    ["muscat", "Muscat", "Oman"],
    ["cairo", "Cairo", "Egypt"],
    ["petra", "Petra", "Jordan"],
    ["beirut", "Beirut", "Lebanon"],
    ["casablanca", "Casablanca", "Morocco"],
    ["marrakech", "Marrakech", "Morocco"]
  ];
  var SLOTS = ["dawn", "day", "dusk", "night"];
  var manifest = {};
  CITIES.forEach(function (c) {
    var slots = {};
    SLOTS.forEach(function (s) {
      slots[s] = { url: "https://picsum.photos/seed/" + c[0] + "-" + s + "/1920/1080", credit: "PLACEHOLDER — replace with a licensed photo + attribution" };
    });
    manifest[c[0]] = { name: c[1], country: c[2], slots: slots };
  });

  // --- Curated, real, free-license photos (Wikimedia Commons). Attribution in CREDITS.md. ---
  // A slot can also carry an optional `video` (looping mp4 URL); the app plays it over the photo.
  var WC = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
  function slot(path, credit) { return { url: WC + path, credit: credit }; }

  manifest.dubai = { name: "Dubai", country: "UAE", slots: {
    dawn:  slot("1/1b/Dubai_Skyline_and_Burj_Khalifa_-_25072008.jpg/1920px-Dubai_Skyline_and_Burj_Khalifa_-_25072008.jpg", "Dubai skyline — petter palander, CC BY 2.0"),
    day:   slot("c/cc/Dubai_Skyline_mit_Burj_Khalifa_%2818241030269%29.jpg/1920px-Dubai_Skyline_mit_Burj_Khalifa_%2818241030269%29.jpg", "Dubai skyline — Tim Reckmann, CC BY 2.0"),
    dusk:  slot("9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/1920px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg", "Burj Khalifa at sunset — imran shahabuddin, CC BY 2.0"),
    night: slot("c/ca/Dubai_Marina_Towers_by_night.jpg/1920px-Dubai_Marina_Towers_by_night.jpg", "Dubai Marina by night — Gfilip, CC BY-SA 4.0")
  }};
  manifest.abudhabi = { name: "Abu Dhabi", country: "UAE", slots: {
    dawn:  slot("e/e9/Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815424395673%29.jpg/1920px-Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815424395673%29.jpg", "Sheikh Zayed Grand Mosque — Guilhem Vellut, CC BY 2.0"),
    day:   slot("b/bc/Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815856602738%29.jpg/1920px-Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815856602738%29.jpg", "Sheikh Zayed Grand Mosque — Guilhem Vellut, CC BY 2.0"),
    dusk:  slot("0/0c/Sheikh_Zayed_Grand_Mosque_approach_09.jpg/1920px-Sheikh_Zayed_Grand_Mosque_approach_09.jpg", "Sheikh Zayed Grand Mosque — OasisTravelCruise, CC BY-SA 4.0"),
    night: slot("0/0c/Sheikh_Zayed_Grand_Mosque_approach_09.jpg/1920px-Sheikh_Zayed_Grand_Mosque_approach_09.jpg", "Sheikh Zayed Grand Mosque — OasisTravelCruise, CC BY-SA 4.0")
  }};
  manifest.cairo = { name: "Cairo", country: "Egypt", slots: {
    dawn:  slot("d/db/Great_Sphinx_of_Giza_%28%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84%29.jpg/1920px-Great_Sphinx_of_Giza_%28%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84%29.jpg", "Great Sphinx of Giza — Petar Milošević, CC BY-SA 4.0"),
    day:   slot("a/af/All_Gizah_Pyramids.jpg/1920px-All_Gizah_Pyramids.jpg", "All Gizah Pyramids — Ricardo Liberato, CC BY-SA 2.0"),
    dusk:  slot("e/e7/Giza_Pyramids_during_%22Forever_is_Now%22_exhibition.jpg/1920px-Giza_Pyramids_during_%22Forever_is_Now%22_exhibition.jpg", "Giza Pyramids, 'Forever is Now' — Mona Hassan Abo-Abda, CC BY-SA 4.0"),
    night: slot("a/ae/Egypt-2B-004_-_Cairo_at_Night_%282216557315%29.jpg/1920px-Egypt-2B-004_-_Cairo_at_Night_%282216557315%29.jpg", "Cairo at Night (Nile) — Dennis G. Jarvis, CC BY-SA 2.0")
  }};
  manifest.muscat = { name: "Muscat", country: "Oman", slots: {
    dawn:  slot("4/48/Sultan_Qaboos_Grand_Mosque_%2819889998133%29.jpg/1920px-Sultan_Qaboos_Grand_Mosque_%2819889998133%29.jpg", "Sultan Qaboos Grand Mosque at sunrise — Riyadh Al Balushi, CC BY 2.0"),
    day:   slot("4/41/Muscat%2C_moschea_del_sultano_qaboos%2C_esterno_01.jpg/1920px-Muscat%2C_moschea_del_sultano_qaboos%2C_esterno_01.jpg", "Sultan Qaboos Grand Mosque — Francesco Bini, CC BY-SA 4.0"),
    dusk:  slot("1/14/Sultan_Qaboos_Grand_Mosque_close_up_view.jpg/1920px-Sultan_Qaboos_Grand_Mosque_close_up_view.jpg", "Sultan Qaboos Grand Mosque — Karananand2, CC0"),
    night: slot("1/14/Sultan_Qaboos_Grand_Mosque_close_up_view.jpg/1920px-Sultan_Qaboos_Grand_Mosque_close_up_view.jpg", "Sultan Qaboos Grand Mosque — Karananand2, CC0")
  }};
  manifest.maldives = { name: "Maldives", country: "Maldives", slots: {
    dawn:  slot("3/3b/Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg/1920px-Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg", "Diamonds Thudufushi water villas — Martin Falbisoner, CC BY-SA 4.0"),
    day:   slot("e/eb/Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg/1920px-Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg", "Anantara Kihavah lagoon — Matheenfaiz, CC BY-SA 4.0"),
    dusk:  slot("e/eb/Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg/1920px-Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg", "Anantara Kihavah lagoon — Matheenfaiz, CC BY-SA 4.0"),
    night: slot("3/3b/Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg/1920px-Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg", "Diamonds Thudufushi water villas — Martin Falbisoner, CC BY-SA 4.0")
  }};

  // Optional dev override (git-ignored): window.SAHIL_PHOTOS_CURATED = { dubai: {...} }
  if (window.SAHIL_PHOTOS_CURATED) {
    Object.keys(window.SAHIL_PHOTOS_CURATED).forEach(function (k) {
      manifest[k] = window.SAHIL_PHOTOS_CURATED[k];
    });
  }
  window.SAHIL_PHOTOS = manifest;
})();
