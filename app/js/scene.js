// Illustrated time-of-day beach scene, drawn on a canvas.
// Used as the "scene" theme and as the fallback when a photo fails to load.
window.Scene = (function () {
  var cv, ctx, stars = [], W = 0, H = 0;
  // keyframes: [hour, skyTopRGB, skyBottomRGB]
  var KF = [
    [0,   [7,11,31],    [15,22,54]],
    [5,   [20,22,54],   [48,42,74]],
    [6.5, [63,90,147],  [255,178,122]],
    [9,   [74,132,196], [191,224,242]],
    [12,  [47,127,214], [169,215,245]],
    [15,  [63,128,201], [207,231,243]],
    [17.5,[90,109,176], [255,176,102]],
    [18.7,[57,64,111],  [255,126,90]],
    [19.8,[29,37,80],   [106,74,122]],
    [21,  [11,18,48],   [20,28,60]],
    [24,  [7,11,31],    [15,22,54]]
  ];
  function lerp(a, b, u) { return a + (b - a) * u; }
  function mix(a, b, u) { return [lerp(a[0],b[0],u), lerp(a[1],b[1],u), lerp(a[2],b[2],u)]; }
  function rgb(c) { return "rgb(" + (c[0]|0) + "," + (c[1]|0) + "," + (c[2]|0) + ")"; }
  function skyAt(t) {
    var i = 0;
    for (; i < KF.length - 1; i++) { if (t >= KF[i][0] && t <= KF[i+1][0]) break; }
    var a = KF[i], b = KF[i+1], u = (t - a[0]) / (b[0] - a[0]);
    return { top: mix(a[1], b[1], u), bot: mix(a[2], b[2], u) };
  }
  function resize() {
    W = cv.width = cv.clientWidth;
    H = cv.height = cv.clientHeight;
    stars = [];
    for (var i = 0; i < 150; i++) stars.push([Math.random()*W, Math.random()*H*0.6, Math.random()*1.4 + 0.4]);
  }
  function init(canvas) {
    cv = canvas; ctx = cv.getContext("2d");
    resize(); window.addEventListener("resize", resize);
  }
  function draw(now, sun) {
    if (!ctx) return;
    var t = now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600;
    var s = skyAt(t);
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgb(s.top)); g.addColorStop(0.62, rgb(s.bot));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    var sunrise = sun && sun.sunrise, sunset = sun && sun.sunset;
    var isDay = (sunrise && sunset) ? (now >= sunrise && now <= sunset) : (t >= 6.2 && t <= 18.6);

    if (!isDay) {
      ctx.save(); ctx.fillStyle = "#fff";
      for (var i = 0; i < stars.length; i++) {
        ctx.globalAlpha = 0.7 * stars[i][2];
        ctx.beginPath(); ctx.arc(stars[i][0], stars[i][1], stars[i][2], 0, 6.2832); ctx.fill();
      }
      ctx.restore();
    }

    var p;
    if (isDay && sunrise && sunset) p = (now - sunrise) / (sunset - sunrise);
    else p = isDay ? (t - 6.2)/12.4 : ((t < 6.2 ? t+24 : t) - 18.6)/11.6;
    p = Math.max(0, Math.min(1, p));
    var bx = W * (0.08 + p*0.84), by = H * (0.58 - Math.sin(p*Math.PI)*0.5);
    var r = Math.min(W, H) * 0.06;

    var glow = ctx.createRadialGradient(bx, by, 0, bx, by, r*2.6);
    if (isDay) { glow.addColorStop(0,"#fff7e8"); glow.addColorStop(.4,"#ffe6a8"); glow.addColorStop(.7,"rgba(255,210,122,.45)"); glow.addColorStop(1,"rgba(255,210,122,0)"); }
    else { glow.addColorStop(0,"#fdfbf4"); glow.addColorStop(.5,"rgba(226,230,245,.45)"); glow.addColorStop(1,"rgba(226,230,245,0)"); }
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(bx, by, r*2.6, 0, 6.2832); ctx.fill();
    ctx.fillStyle = isDay ? "#fff3d6" : "#eef0f7";
    ctx.beginPath(); ctx.arc(bx, by, r, 0, 6.2832); ctx.fill();

    var seaTop = mix(s.bot, [12,22,46], 0.35), seaBot = [s.bot[0]*0.28, s.bot[1]*0.28, s.bot[2]*0.28];
    var sg = ctx.createLinearGradient(0, H*0.62, 0, H);
    sg.addColorStop(0, rgb(seaTop)); sg.addColorStop(1, rgb(seaBot));
    ctx.fillStyle = sg; ctx.fillRect(0, H*0.62, W, H*0.38);

    ctx.save(); ctx.globalAlpha = 0.5;
    var rg = ctx.createLinearGradient(0, H*0.62, 0, H);
    rg.addColorStop(0, isDay ? "rgba(255,224,150,.9)" : "rgba(226,230,245,.8)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg; ctx.fillRect(bx - W*0.03, H*0.62, W*0.06, H*0.38);
    ctx.restore();
  }
  return { init: init, draw: draw };
})();
