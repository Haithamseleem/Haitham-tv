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
  manifest.mecca = { name: "Mecca", country: "Saudi Arabia", slots: {
    dawn:  slot("5/51/Masjid_al-Haram_2022.jpg/1920px-Masjid_al-Haram_2022.jpg", "Masjid al-Haram — CC0"),
    day:   slot("b/b3/The_Kaaba_during_Hajj_-_edited.jpg/1920px-The_Kaaba_during_Hajj_-_edited.jpg", "The Kaaba during Hajj — Adli Wahid, CC BY-SA 4.0"),
    dusk:  slot("2/22/Kaaba%2C_Masjid_Al-Haram%2C_Mecca%2C_Saudi_Arabia_-_panoramio.jpg/1920px-Kaaba%2C_Masjid_Al-Haram%2C_Mecca%2C_Saudi_Arabia_-_panoramio.jpg", "Kaaba, Masjid Al-Haram — GusJuned, CC BY-SA 3.0"),
    night: slot("c/c1/Masjid_al-Haram%2C_Tawaf_20092012_1130PM_%288008466944%29.jpg/1920px-Masjid_al-Haram%2C_Tawaf_20092012_1130PM_%288008466944%29.jpg", "Masjid al-Haram at night — Basheer Olakara, CC BY 2.0")
  }};
  manifest.medina = { name: "Medina", country: "Saudi Arabia", slots: {
    dawn:  slot("4/4b/Al-Masjid_an_Nabawi.jpg/1920px-Al-Masjid_an_Nabawi.jpg", "Al-Masjid an-Nabawi — Meshari Alawfi, CC BY 4.0"),
    day:   slot("b/bc/Medium_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg/1920px-Medium_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg", "Green Dome, Prophet's Mosque — TheHadiRahim, CC0"),
    dusk:  slot("a/a0/Al_Masjid_an_Nabawi_3.jpg/1920px-Al_Masjid_an_Nabawi_3.jpg", "Al-Masjid an-Nabawi — Aymanzaid2, CC BY-SA 4.0"),
    night: slot("a/a0/Al_Masjid_an_Nabawi_3.jpg/1920px-Al_Masjid_an_Nabawi_3.jpg", "Al-Masjid an-Nabawi — Aymanzaid2, CC BY-SA 4.0")
  }};
  manifest.jerusalem = { name: "Jerusalem", country: "Palestine", slots: {
    dawn:  slot("a/a3/Jerusalem-2013-Temple_Mount-Dome_of_the_Rock_%26_Chain.jpg/1920px-Jerusalem-2013-Temple_Mount-Dome_of_the_Rock_%26_Chain.jpg", "Dome of the Rock — Godot13, CC BY-SA 4.0"),
    day:   slot("6/66/Jerusalem-2013-Temple_Mount-Dome_of_the_Rock_%26_Chain_02.jpg/1920px-Jerusalem-2013-Temple_Mount-Dome_of_the_Rock_%26_Chain_02.jpg", "Dome of the Rock — Godot13, CC BY-SA 4.0"),
    dusk:  slot("8/8b/Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg/1920px-Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg", "Dome of the Rock — Godot13, CC BY-SA 4.0"),
    night: slot("8/8b/Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg/1920px-Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg", "Dome of the Rock — Godot13, CC BY-SA 4.0")
  }};
  manifest.doha = { name: "Doha", country: "Qatar", slots: {
    dawn:  slot("8/86/Doha_skyline_in_the_morning_%2812544910974%29.jpg/1920px-Doha_skyline_in_the_morning_%2812544910974%29.jpg", "Doha skyline, morning — Francisco Anzola, CC BY 2.0"),
    day:   slot("a/a2/Doha_Skyline_01.jpg/1920px-Doha_Skyline_01.jpg", "Doha skyline — Zairon, CC BY 4.0"),
    dusk:  slot("a/a5/Doha_Skyline_02.jpg/1920px-Doha_Skyline_02.jpg", "Doha skyline — Zairon, CC BY 4.0"),
    night: slot("f/f3/Doha_West_Bay_Skyline_Qatar_Jan_2020.jpg/1920px-Doha_West_Bay_Skyline_Qatar_Jan_2020.jpg", "Doha West Bay at night — Thameur Belghith, CC BY-SA 4.0")
  }};
  manifest.riyadh = { name: "Riyadh", country: "Saudi Arabia", slots: {
    dawn:  slot("9/98/Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_%28KAFD%29_and_the_famous_Kingdom_Tower_.jpg/1920px-Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_%28KAFD%29_and_the_famous_Kingdom_Tower_.jpg", "Riyadh skyline (KAFD) — B.alotaby, CC BY-SA 4.0"),
    day:   slot("9/98/Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_%28KAFD%29_and_the_famous_Kingdom_Tower_.jpg/1920px-Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_%28KAFD%29_and_the_famous_Kingdom_Tower_.jpg", "Riyadh skyline (KAFD) — B.alotaby, CC BY-SA 4.0"),
    dusk:  slot("2/20/Riyadh_Skyline.jpg/1920px-Riyadh_Skyline.jpg", "Riyadh skyline at night — B.alotaby, CC BY-SA 4.0"),
    night: slot("2/20/Riyadh_Skyline.jpg/1920px-Riyadh_Skyline.jpg", "Riyadh skyline at night — B.alotaby, CC BY-SA 4.0")
  }};
  manifest.muscat = { name: "Muscat", country: "Oman", slots: {
    dawn:  slot("4/48/Sultan_Qaboos_Grand_Mosque_%2819889998133%29.jpg/1920px-Sultan_Qaboos_Grand_Mosque_%2819889998133%29.jpg", "Sultan Qaboos Grand Mosque at sunrise — Riyadh Al Balushi, CC BY 2.0"),
    day:   slot("4/41/Muscat%2C_moschea_del_sultano_qaboos%2C_esterno_01.jpg/1920px-Muscat%2C_moschea_del_sultano_qaboos%2C_esterno_01.jpg", "Sultan Qaboos Grand Mosque — Francesco Bini, CC BY-SA 4.0"),
    dusk:  slot("1/14/Sultan_Qaboos_Grand_Mosque_close_up_view.jpg/1920px-Sultan_Qaboos_Grand_Mosque_close_up_view.jpg", "Sultan Qaboos Grand Mosque — Karananand2, CC0"),
    night: slot("1/14/Sultan_Qaboos_Grand_Mosque_close_up_view.jpg/1920px-Sultan_Qaboos_Grand_Mosque_close_up_view.jpg", "Sultan Qaboos Grand Mosque — Karananand2, CC0")
  }};
  manifest.cairo = { name: "Cairo", country: "Egypt", slots: {
    dawn:  slot("d/db/Great_Sphinx_of_Giza_%28%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84%29.jpg/1920px-Great_Sphinx_of_Giza_%28%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84%29.jpg", "Great Sphinx of Giza — Petar Milošević, CC BY-SA 4.0"),
    day:   slot("a/af/All_Gizah_Pyramids.jpg/1920px-All_Gizah_Pyramids.jpg", "All Gizah Pyramids — Ricardo Liberato, CC BY-SA 2.0"),
    dusk:  slot("e/e7/Giza_Pyramids_during_%22Forever_is_Now%22_exhibition.jpg/1920px-Giza_Pyramids_during_%22Forever_is_Now%22_exhibition.jpg", "Giza Pyramids, 'Forever is Now' — Mona Hassan Abo-Abda, CC BY-SA 4.0"),
    night: slot("a/ae/Egypt-2B-004_-_Cairo_at_Night_%282216557315%29.jpg/1920px-Egypt-2B-004_-_Cairo_at_Night_%282216557315%29.jpg", "Cairo at Night (Nile) — Dennis G. Jarvis, CC BY-SA 2.0")
  }};
  manifest.maldives = { name: "Maldives", country: "Maldives", slots: {
    dawn:  slot("3/3b/Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg/1920px-Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg", "Diamonds Thudufushi water villas — Martin Falbisoner, CC BY-SA 4.0"),
    day:   slot("e/eb/Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg/1920px-Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg", "Anantara Kihavah lagoon — Matheenfaiz, CC BY-SA 4.0"),
    dusk:  slot("e/eb/Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg/1920px-Anantara_Kihavah_-_Aerial_Hero_Shot_2024.jpg", "Anantara Kihavah lagoon — Matheenfaiz, CC BY-SA 4.0"),
    night: slot("3/3b/Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg/1920px-Diamonds_Thudufushi_Beach_and_Water_Villas%2C_May_2017_-04.jpg", "Diamonds Thudufushi water villas — Martin Falbisoner, CC BY-SA 4.0")
  }};

  manifest.kuwait = { name: "Kuwait City", country: "Kuwait", slots: {
    dawn:  slot("d/d9/Kuwait_City_Kuwait_Towers_Panoramic_View_2.jpg/1920px-Kuwait_City_Kuwait_Towers_Panoramic_View_2.jpg", "Kuwait Towers — Zairon, CC BY 4.0"),
    day:   slot("e/e3/Kuwait_City_Kuwait_Towers_Panoramic_View_1.jpg/1920px-Kuwait_City_Kuwait_Towers_Panoramic_View_1.jpg", "Kuwait Towers — Zairon, CC BY 4.0"),
    dusk:  slot("7/7f/Kuwait_City_Kuwait_Towers_Panoramic_View_3.jpg/1920px-Kuwait_City_Kuwait_Towers_Panoramic_View_3.jpg", "Kuwait Towers — Zairon, CC BY 4.0"),
    night: slot("f/f1/Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg/1920px-Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg", "Kuwait Towers — Zairon, CC BY 4.0")
  }};
  manifest.manama = { name: "Manama", country: "Bahrain", slots: {
    dawn:  slot("5/5c/Manama_Manama_Skyline_13.jpg/1920px-Manama_Manama_Skyline_13.jpg", "Manama skyline — Zairon, CC BY-SA 4.0"),
    day:   slot("8/82/Manama_Bahrain_Bay_01.jpg/1920px-Manama_Bahrain_Bay_01.jpg", "Manama, Bahrain Bay — Zairon, CC BY-SA 4.0"),
    dusk:  slot("3/37/Manama_Manama_Skyline_14.jpg/1920px-Manama_Manama_Skyline_14.jpg", "Manama skyline — Zairon, CC BY-SA 4.0"),
    night: slot("b/be/Manama_Manama_Skyline_12.jpg/1920px-Manama_Manama_Skyline_12.jpg", "Manama skyline — Zairon, CC BY-SA 4.0")
  }};
  manifest.petra = { name: "Petra", country: "Jordan", slots: {
    dawn:  slot("4/4e/The_Treasury%2C_Petra%2C_Jordan1.jpg/1920px-The_Treasury%2C_Petra%2C_Jordan1.jpg", "The Treasury, Petra — Diego Delso, CC BY-SA 3.0"),
    day:   slot("0/0b/Al-Khazneh%2C_Petra%2C_Jordan.jpg/1920px-Al-Khazneh%2C_Petra%2C_Jordan.jpg", "Al-Khazneh, Petra — Vyacheslav Argenberg, CC BY 4.0"),
    dusk:  slot("e/e8/Al-Khazneh_%28The_Treasury%29%2C_Petra%2C_Jordan.jpg/1920px-Al-Khazneh_%28The_Treasury%29%2C_Petra%2C_Jordan.jpg", "Al-Khazneh, Petra — Vyacheslav Argenberg, CC BY 4.0"),
    night: slot("e/e8/Al-Khazneh_%28The_Treasury%29%2C_Petra%2C_Jordan.jpg/1920px-Al-Khazneh_%28The_Treasury%29%2C_Petra%2C_Jordan.jpg", "Al-Khazneh, Petra — Vyacheslav Argenberg, CC BY 4.0")
  }};
  manifest.beirut = { name: "Beirut", country: "Lebanon", slots: {
    dawn:  slot("7/75/Beirut_skyline_view.jpg/1920px-Beirut_skyline_view.jpg", "Beirut skyline — Laura C Ellis, CC BY-SA 4.0"),
    day:   slot("e/e8/Beirut_skyline%2C_Beirut%2C_Lebanon.jpg/1920px-Beirut_skyline%2C_Beirut%2C_Lebanon.jpg", "Beirut skyline — Vyacheslav Argenberg, CC BY 4.0"),
    dusk:  slot("b/bc/Beirut_Skyline_1.jpg/1920px-Beirut_Skyline_1.jpg", "Beirut skyline at dusk — Freedom's Falcon, CC BY-SA 3.0"),
    night: slot("9/9e/Beirut_Skyline_-_panoramio.jpg/1920px-Beirut_Skyline_-_panoramio.jpg", "Beirut skyline at night — Evilscaught, CC BY 3.0")
  }};
  manifest.casablanca = { name: "Casablanca", country: "Morocco", slots: {
    dawn:  slot("8/8a/Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber%27s_portfolio.jpg/1920px-Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber%27s_portfolio.jpg", "Hassan II Mosque at sunrise — Milamber's portfolio, CC BY 2.0"),
    day:   slot("d/d0/Mezquita_Hassan_II_%28reflejo_en_agua%29.jpg/1920px-Mezquita_Hassan_II_%28reflejo_en_agua%29.jpg", "Hassan II Mosque — Fraguando, CC BY-SA 4.0"),
    dusk:  slot("0/06/The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg/1920px-The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg", "Hassan II Mosque — Ayman.mesa25, CC BY-SA 4.0"),
    night: slot("0/06/The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg/1920px-The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg", "Hassan II Mosque — Ayman.mesa25, CC BY-SA 4.0")
  }};
  manifest.marrakech = { name: "Marrakech", country: "Morocco", slots: {
    dawn:  slot("f/fc/Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250125_0859_7061.jpg/1920px-Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250125_0859_7061.jpg", "Koutoubia Mosque, morning — Jakub Hałun, CC BY 4.0"),
    day:   slot("1/10/Koutoubia_minaret_from_the_city.JPG/1920px-Koutoubia_minaret_from_the_city.JPG", "Koutoubia minaret — Schorle, CC BY-SA 4.0"),
    dusk:  slot("6/61/Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250124_1834_7027.jpg/1920px-Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250124_1834_7027.jpg", "Koutoubia Mosque at sunset — Jakub Hałun, CC BY 4.0"),
    night: slot("0/01/Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250124_1838_7030.jpg/1920px-Kutubiyya_Mosque%2C_Marrakesh%2C_Morocco%2C_20250124_1838_7030.jpg", "Koutoubia Mosque, golden hour — Jakub Hałun, CC BY 4.0")
  }};

  // Optional dev override (git-ignored): window.HAITHAM_PHOTOS_CURATED = { dubai: {...} }
  if (window.HAITHAM_PHOTOS_CURATED) {
    Object.keys(window.HAITHAM_PHOTOS_CURATED).forEach(function (k) {
      manifest[k] = window.HAITHAM_PHOTOS_CURATED[k];
    });
  }
  window.HAITHAM_PHOTOS = manifest;
})();
