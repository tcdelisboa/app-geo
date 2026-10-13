(() => {
  // src/util.js
  var G = window.Giro;
  function offset(origin, east, north) {
    return {
      lat: origin.lat + north / 111320,
      lng: origin.lng + east / (111320 * Math.cos(origin.lat * Math.PI / 180))
    };
  }
  function distance(a, b) {
    const R = 6371e3, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  var WEEK = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
  var DAYMONTH = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });
  var LONG = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  function today0() {
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function addHours(d, h) {
    return new Date(d.getTime() + h * 36e5);
  }
  function nextHour() {
    return Math.min(23, (/* @__PURE__ */ new Date()).getHours() + 1);
  }
  function startOf(search) {
    return addHours(today0(), search.dayOffset * 24 + search.startHour);
  }
  function hhmm(d) {
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function trimDot(s) {
    return s.replace(/\.$/, "");
  }
  function dayLabel(d, lower) {
    const diff = Math.round((new Date(d).setHours(0, 0, 0, 0) - today0().getTime()) / 864e5);
    if (diff === 0) return lower ? "hoje" : "Hoje";
    if (diff === 1) return lower ? "amanh\xE3" : "Amanh\xE3";
    if (diff === -1) return lower ? "ontem" : "Ontem";
    const w = trimDot(WEEK.format(d));
    return (lower ? w : w[0].toUpperCase() + w.slice(1)) + ", " + trimDot(DAYMONTH.format(d)).replace(" de ", " ");
  }
  function longDate(d) {
    const s = LONG.format(d);
    return s[0].toUpperCase() + s.slice(1);
  }
  function rangeText(start, hours) {
    const end = addHours(start, hours);
    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) return dayLabel(start) + " \xB7 " + hhmm(start) + " \u2013 " + hhmm(end);
    return dayLabel(start) + " " + hhmm(start) + " \u2013 " + dayLabel(end, true) + " " + hhmm(end);
  }
  function hoursText(h) {
    if (h < 24 || h % 24) return h + " h";
    return h === 24 ? "1 dia" : h / 24 + " dias";
  }
  var brl = (v) => G.formatBRL(v);
  var brl0 = (v) => G.formatBRL(v, { cents: false });
  function firstName(name) {
    return name.split(" ")[0];
  }
  function cx(...a) {
    return a.filter(Boolean).join(" ");
  }
  function code() {
    const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let s = "GR-";
    for (let i = 0; i < 4; i++) s += A[Math.floor(Math.random() * A.length)];
    return s;
  }
  function load(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
    }
  }

  // src/components.jsx
  var { useState, useEffect, useRef } = React;
  var BODIES = {
    hatch: {
      body: "M18 96 C18 84 24 76 40 73 L96 66 L132 40 C136 37 140 36 146 36 L238 36 C246 36 252 40 256 46 L288 70 C296 74 300 80 300 90 L300 100 C300 104 297 106 293 106 L264 106 A26 26 0 0 0 212 106 L104 106 A26 26 0 0 0 52 106 L24 106 C20 106 18 103 18 100 Z",
      glass: ["M106 66 L137 44 C139 42 142 41 146 41 L184 41 L184 66 Z", "M192 41 L236 41 C242 41 246 44 249 48 L272 66 L192 66 Z"],
      wheels: [78, 238],
      r: 22,
      door: "M188 70 L188 100",
      handle: [200, 76],
      light: [[22, 80, 14, 6], [286, 76, 12, 7]]
    },
    sedan: {
      body: "M16 96 C16 84 22 76 38 73 L94 66 L132 40 C136 37 140 36 146 36 L220 36 C228 36 234 40 238 44 L262 64 L292 68 C298 70 304 78 304 88 L304 100 C304 104 301 106 297 106 L266 106 A26 26 0 0 0 214 106 L102 106 A26 26 0 0 0 50 106 L22 106 C18 106 16 103 16 100 Z",
      glass: ["M104 66 L136 44 C138 42 141 41 145 41 L180 41 L180 66 Z", "M188 41 L218 41 C224 41 229 43 232 47 L250 64 L188 66 Z"],
      wheels: [76, 240],
      r: 22,
      door: "M184 70 L184 100",
      handle: [196, 76],
      light: [[20, 80, 14, 6], [290, 74, 12, 7]]
    },
    suv: {
      body: "M16 96 C16 82 22 72 38 68 L92 60 L124 30 C128 27 132 26 138 26 L272 26 C282 26 288 30 290 38 L298 64 C302 70 304 78 304 88 L304 100 C304 104 301 106 297 106 L266 106 A28 28 0 0 0 210 106 L106 106 A28 28 0 0 0 50 106 L22 106 C18 106 16 103 16 100 Z",
      glass: ["M102 60 L130 34 C133 32 136 31 140 31 L188 31 L188 60 Z", "M196 31 L270 31 C276 31 280 34 282 40 L288 60 L196 60 Z"],
      wheels: [78, 238],
      r: 24,
      door: "M192 64 L192 100",
      handle: [204, 70],
      light: [[20, 76, 14, 7], [290, 70, 10, 9]]
    }
  };
  function CarArt({ car, className, ground = true }) {
    const b = BODIES[car.body] || BODIES.hatch;
    return /* @__PURE__ */ React.createElement("svg", { className: cx("car-art", className), viewBox: "0 0 320 132", role: "img", "aria-label": `${car.model} ${car.colorName ? car.colorName.toLowerCase() : ""}` }, ground ? /* @__PURE__ */ React.createElement("ellipse", { cx: "160", cy: "114", rx: "146", ry: "8", className: "car-art-shadow" }) : null, /* @__PURE__ */ React.createElement("path", { d: b.body, fill: car.color, className: "car-art-body" }), /* @__PURE__ */ React.createElement("path", { d: b.body, fill: "url(#car-art-shade)" }), b.glass.map((d, i) => /* @__PURE__ */ React.createElement("path", { key: i, d, className: "car-art-glass" })), /* @__PURE__ */ React.createElement("path", { d: b.door, className: "car-art-line" }), /* @__PURE__ */ React.createElement("rect", { x: b.handle[0], y: b.handle[1], width: "12", height: "3", rx: "1.5", className: "car-art-line-fill" }), /* @__PURE__ */ React.createElement("rect", { x: b.light[0][0], y: b.light[0][1], width: b.light[0][2], height: b.light[0][3], rx: "3", className: "car-art-head" }), /* @__PURE__ */ React.createElement("rect", { x: b.light[1][0], y: b.light[1][1], width: b.light[1][2], height: b.light[1][3], rx: "3", className: "car-art-tail" }), b.wheels.map((x) => /* @__PURE__ */ React.createElement("g", { key: x }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: "106", r: b.r, className: "car-art-tire" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: "106", r: b.r * 0.5, className: "car-art-rim" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: "106", r: "3", className: "car-art-tire" }))));
  }
  function ArtDefs() {
    return /* @__PURE__ */ React.createElement("svg", { width: "0", height: "0", style: { position: "absolute" }, "aria-hidden": "true", focusable: "false" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "car-art-shade", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: "#ffffff", stopOpacity: ".22" }), /* @__PURE__ */ React.createElement("stop", { offset: ".55", stopColor: "#ffffff", stopOpacity: "0" }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: "#000000", stopOpacity: ".18" }))));
  }
  function carPhoto(car) {
    const b = BODIES[car.body] || BODIES.hatch;
    const r = (x) => `<rect x="${x[0]}" y="${x[1]}" width="${x[2]}" height="${x[3]}" rx="3"`;
    const wheels = b.wheels.map((x) => `<circle cx="${x}" cy="106" r="${b.r}" fill="#1d1e21"/><circle cx="${x}" cy="106" r="${b.r * 0.5}" fill="#a9acb1" stroke="#6d7076" stroke-width="1.5"/><circle cx="${x}" cy="106" r="3" fill="#1d1e21"/>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -20 340 160"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs><path d="${b.body}" fill="${car.color}" stroke="#0000002e"/><path d="${b.body}" fill="url(#s)"/>` + b.glass.map((d) => `<path d="${d}" fill="#1f2a33" fill-opacity=".88"/>`).join("") + `<path d="${b.door}" stroke="#00000038" stroke-width="1.5"/>${r(b.light[0])} fill="#fff6d6"/>${r(b.light[1])} fill="#c4321b"/>${wheels}</svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  function TopBar({ title, onBack, right, transparent, sub }) {
    return /* @__PURE__ */ React.createElement("header", { className: cx("topbar", transparent && "topbar-clear") }, onBack ? /* @__PURE__ */ React.createElement(G.IconButton, { icon: "chevron-left", label: "Voltar", variant: transparent ? "floating" : "plain", onClick: onBack }) : /* @__PURE__ */ React.createElement("span", { className: "topbar-gap" }), title ? /* @__PURE__ */ React.createElement("div", { className: "topbar-titles" }, /* @__PURE__ */ React.createElement("h1", { className: "topbar-title" }, title), sub ? /* @__PURE__ */ React.createElement("p", { className: "topbar-sub" }, sub) : null) : /* @__PURE__ */ React.createElement("span", { className: "topbar-fill" }), right || /* @__PURE__ */ React.createElement("span", { className: "topbar-gap" }));
  }
  function Section({ title, children, action, className }) {
    return /* @__PURE__ */ React.createElement("section", { className: cx("section", className) }, title ? /* @__PURE__ */ React.createElement("div", { className: "section-head" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, title), action) : null, children);
  }
  function Row({ icon, label, value, sub, onClick, right, tone }) {
    const Tag = onClick ? "button" : "div";
    return /* @__PURE__ */ React.createElement(Tag, { className: cx("row", onClick && "row-btn"), onClick, type: onClick ? "button" : void 0 }, icon ? /* @__PURE__ */ React.createElement("span", { className: cx("row-icon", tone && "row-icon-" + tone) }, /* @__PURE__ */ React.createElement(G.Icon, { name: icon, size: 20 })) : null, /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, label), sub ? /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, sub) : null), value ? /* @__PURE__ */ React.createElement("span", { className: "row-value" }, value) : null, right, onClick && !right ? /* @__PURE__ */ React.createElement(G.Icon, { name: "chevron-right", size: 18, className: "row-chev" }) : null);
  }
  function Radio({ checked, onChange, label, sub, right, name }) {
    return /* @__PURE__ */ React.createElement("label", { className: cx("radio", checked && "radio-on") }, /* @__PURE__ */ React.createElement("input", { type: "radio", name, checked, onChange }), /* @__PURE__ */ React.createElement("span", { className: "radio-dot", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, label), sub ? /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, sub) : null), right ? /* @__PURE__ */ React.createElement("span", { className: "row-value" }, right) : null);
  }
  function Switch({ checked, onChange, label }) {
    return /* @__PURE__ */ React.createElement("button", { type: "button", role: "switch", "aria-checked": checked, "aria-label": label, className: cx("switch", checked && "switch-on"), onClick: () => onChange(!checked) }, /* @__PURE__ */ React.createElement("span", { className: "switch-knob" }));
  }
  function Stars({ value, size = 14 }) {
    return /* @__PURE__ */ React.createElement("span", { className: "stars", "aria-label": `${value} de 5 estrelas` }, [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement(G.Icon, { key: i, name: "star", size, filled: i <= Math.round(value), strokeWidth: i <= Math.round(value) ? 0 : 1.5 })));
  }
  function Avatar({ name, size = 40 }) {
    const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
    return /* @__PURE__ */ React.createElement("span", { className: "avatar", style: { width: size, height: size, fontSize: Math.round(size * 0.36) }, "aria-hidden": "true" }, initials);
  }
  function Toast({ message }) {
    return message ? /* @__PURE__ */ React.createElement("div", { className: "toast", role: "status", key: message.id }, message.text) : null;
  }
  function EarningsChart({ weeks, labels }) {
    const [hover, setHover] = useState(null);
    const max = Math.max(...weeks) * 1.1;
    const W = 326, H = 120, gap = 10, bw = (W - gap * (weeks.length - 1)) / weeks.length;
    return /* @__PURE__ */ React.createElement("figure", { className: "chart" }, /* @__PURE__ */ React.createElement("div", { className: "chart-plot" }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H + 20}`, width: "100%", role: "img", "aria-label": "Ganhos por semana: " + weeks.map((v, i) => labels[i] + " " + brl0(v)).join(", ") }, /* @__PURE__ */ React.createElement("line", { x1: "0", x2: W, y1: H, y2: H, className: "chart-base" }), weeks.map((v, i) => {
      const h = Math.max(4, v / max * H), x = i * (bw + gap), last = i === weeks.length - 1;
      return /* @__PURE__ */ React.createElement("g", { key: i, onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null), onFocus: () => setHover(i), onBlur: () => setHover(null), tabIndex: 0, "aria-label": labels[i] + ": " + brl0(v) }, /* @__PURE__ */ React.createElement("rect", { x: x - gap / 2, y: "0", width: bw + gap, height: H + 20, fill: "transparent" }), /* @__PURE__ */ React.createElement("path", { d: `M${x} ${H} V${H - h + 4} Q${x} ${H - h} ${x + 4} ${H - h} H${x + bw - 4} Q${x + bw} ${H - h} ${x + bw} ${H - h + 4} V${H} Z`, className: cx("chart-bar", last && "chart-bar-now", hover === i && "chart-bar-hover") }), /* @__PURE__ */ React.createElement("text", { x: x + bw / 2, y: H + 15, textAnchor: "middle", className: "chart-label" }, labels[i]));
    })), hover != null ? /* @__PURE__ */ React.createElement("div", { className: "chart-tip", style: { left: `${(hover + 0.5) / weeks.length * 100}%` } }, /* @__PURE__ */ React.createElement("strong", null, brl0(weeks[hover])), /* @__PURE__ */ React.createElement("span", null, labels[hover] === "Atual" ? "esta semana" : "semana de " + labels[hover])) : null));
  }
  function DemoQR({ seed = 7 }) {
    const N = 29, cells = [];
    let s = seed;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const finder = (x, y) => x < 7 && y < 7 || x >= N - 7 && y < 7 || x < 7 && y >= N - 7;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.52) cells.push(/* @__PURE__ */ React.createElement("rect", { key: x + "-" + y, x, y, width: "1", height: "1" }));
    const F = ({ x, y }) => /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x, y, width: "7", height: "7" }), /* @__PURE__ */ React.createElement("rect", { x: x + 1, y: y + 1, width: "5", height: "5", className: "qr-bg" }), /* @__PURE__ */ React.createElement("rect", { x: x + 2, y: y + 2, width: "3", height: "3" }));
    return /* @__PURE__ */ React.createElement("svg", { className: "qr", viewBox: `-2 -2 ${N + 4} ${N + 4}`, role: "img", "aria-label": "QR code Pix de demonstra\xE7\xE3o", shapeRendering: "crispEdges" }, /* @__PURE__ */ React.createElement("rect", { x: "-2", y: "-2", width: N + 4, height: N + 4, className: "qr-bg" }), cells, /* @__PURE__ */ React.createElement(F, { x: 0, y: 0 }), /* @__PURE__ */ React.createElement(F, { x: N - 7, y: 0 }), /* @__PURE__ */ React.createElement(F, { x: 0, y: N - 7 }));
  }
  function useNow(ms = 1e3) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
      const t = setInterval(() => setNow(Date.now()), ms);
      return () => clearInterval(t);
    }, [ms]);
    return now;
  }

  // src/map.jsx
  var { useState: useState2, useEffect: useEffect2, useRef: useRef2, useMemo } = React;
  var TILES = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  };
  var ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
  function pinHtml(car, selected) {
    const price = G.formatBRL(car.price, { cents: false });
    const label = `${car.model} ${car.year}, ${price} por hora${car.unavailable ? ", indispon\xEDvel no hor\xE1rio" : ""}`;
    return `<div class="gr-map-marker" style="left:0;top:0"><button type="button" class="gr-pin${selected ? " gr-pin-selected" : ""}${car.unavailable ? " gr-pin-unavailable" : ""}${car.mine ? " pin-mine" : ""}" aria-pressed="${selected}" aria-label="${esc(label)}"><span class="gr-pin-body">${esc(price)}</span></button></div>`;
  }
  function MapView(props) {
    const [fallback, setFallback] = useState2(!window.L || window.GIRO_MAP === "drawn");
    return fallback ? /* @__PURE__ */ React.createElement(DrawnMap, { ...props }) : /* @__PURE__ */ React.createElement(LeafletMap, { ...props, onTilesFailed: () => setFallback(true) });
  }
  function LeafletMap(props) {
    const L = window.L;
    const el = useRef2(null), mapRef = useRef2(null), tilesRef = useRef2(null), markers = useRef2({}), meRef = useRef2(null);
    const cb = useRef2(props);
    cb.current = props;
    useEffect2(() => {
      const map = L.map(el.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.5 });
      map.attributionControl.setPrefix(false);
      map.setView([props.center.lat, props.center.lng], 15);
      map.on("click", () => cb.current.onBlank && cb.current.onBlank());
      mapRef.current = map;
      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(el.current);
      return () => {
        ro.disconnect();
        map.remove();
      };
    }, []);
    useEffect2(() => {
      const map = mapRef.current;
      if (tilesRef.current) map.removeLayer(tilesRef.current);
      let loaded = 0, failed = 0;
      const layer = L.tileLayer(TILES[props.theme], { maxZoom: 19, subdomains: "abcd", attribution: ATTRIBUTION });
      layer.on("tileload", () => {
        loaded++;
      });
      layer.on("tileerror", () => {
        failed++;
        if (!loaded && failed >= 4) cb.current.onTilesFailed();
      });
      tilesRef.current = layer.addTo(map);
    }, [props.theme]);
    useEffect2(() => {
      mapRef.current.setView([props.center.lat, props.center.lng], 15, { animate: false });
    }, [props.center.lat, props.center.lng]);
    useEffect2(() => {
      const map = mapRef.current, seen = {};
      props.cars.forEach((car) => {
        seen[car.id] = true;
        const selected = car.id === props.selectedId;
        const icon = L.divIcon({ className: "giro-marker", html: pinHtml(car, selected), iconSize: [0, 0] });
        let m = markers.current[car.id];
        if (!m) {
          m = L.marker([car.pos.lat, car.pos.lng], { icon, keyboard: false, riseOnHover: true });
          m.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            cb.current.onSelect(car.id);
          });
          m.addTo(map);
          markers.current[car.id] = m;
        } else {
          m.setLatLng([car.pos.lat, car.pos.lng]);
          m.setIcon(icon);
        }
        m.setZIndexOffset(selected ? 1e3 : car.unavailable ? -100 : 0);
      });
      Object.keys(markers.current).forEach((id) => {
        if (!seen[id]) {
          map.removeLayer(markers.current[id]);
          delete markers.current[id];
        }
      });
    }, [props.cars, props.selectedId]);
    useEffect2(() => {
      const map = mapRef.current;
      if (meRef.current) {
        map.removeLayer(meRef.current);
        meRef.current = null;
      }
      if (!props.me) return;
      meRef.current = L.marker([props.me.lat, props.me.lng], {
        icon: L.divIcon({ className: "giro-marker", html: '<span class="gr-me" style="left:0;top:0" role="img" aria-label="Voc\xEA est\xE1 aqui"></span>', iconSize: [0, 0] }),
        keyboard: false,
        interactive: false,
        zIndexOffset: 500
      }).addTo(map);
    }, [props.me]);
    useEffect2(() => {
      const t = props.focus, map = mapRef.current;
      if (!t) return;
      map.invalidateSize();
      if (t.zoom) map.setZoom(t.zoom, { animate: false });
      const size = map.getSize(), pad = cb.current.padding;
      const want = L.point(pad.left + (size.x - pad.left - pad.right) / 2, pad.top + (size.y - pad.top - pad.bottom) / 2);
      const p = map.latLngToContainerPoint([t.lat, t.lng]);
      map.panBy(p.subtract(want), { animate: true, duration: 0.45 });
    }, [props.focus]);
    return /* @__PURE__ */ React.createElement("div", { ref: el, className: "map", role: "region", "aria-label": "Mapa de carros dispon\xEDveis" });
  }
  function DrawnMap(props) {
    const el = useRef2(null);
    const [size, setSize] = useState2({ w: 390, h: 844 });
    useEffect2(() => {
      const ro = new ResizeObserver(() => setSize({ w: el.current.clientWidth, h: el.current.clientHeight }));
      ro.observe(el.current);
      return () => ro.disconnect();
    }, []);
    const mPerPx = 3200 / Math.max(320, size.w);
    const toPct = (pos) => {
      const east = (pos.lng - props.center.lng) * 111320 * Math.cos(props.center.lat * Math.PI / 180);
      const north = (pos.lat - props.center.lat) * 111320;
      return { x: 50 + east / mPerPx / size.w * 100, y: 50 - north / mPerPx / size.h * 100 };
    };
    const pins = props.cars.map((c) => Object.assign({ id: c.id, price: c.price, label: c.model + " " + c.year, unavailable: c.unavailable }, toPct(c.pos)));
    const [off, setOff] = useState2({ x: 0, y: 0 });
    useEffect2(() => {
      const t = props.focus;
      if (!t) return;
      const p = toPct(t), pad = props.padding;
      const wantX = pad.left + (size.w - pad.left - pad.right) / 2, wantY = pad.top + (size.h - pad.top - pad.bottom) / 2;
      setOff({ x: wantX - p.x / 100 * size.w, y: wantY - p.y / 100 * size.h });
    }, [props.focus]);
    useEffect2(() => {
      setOff({ x: 0, y: 0 });
    }, [props.center.lat, props.center.lng]);
    return /* @__PURE__ */ React.createElement("div", { ref: el, className: "map map-drawn", onClick: (e) => {
      if (e.target === e.currentTarget || e.target.tagName === "svg" || e.target.tagName === "rect" || e.target.tagName === "path") props.onBlank && props.onBlank();
    } }, /* @__PURE__ */ React.createElement(G.MapCanvas, { pins, selectedId: props.selectedId, onSelect: props.onSelect, me: props.me ? toPct(props.me) : null, offset: off, style: { position: "absolute", inset: 0 }, ariaLabel: "Mapa de carros dispon\xEDveis" }));
  }

  // src/data.js
  var CONFIG = {
    origin: { lat: -23.5665, lng: -46.6915 },
    feeRate: 0.1,
    // taxa de serviço paga por quem aluga
    ownerCommission: 0.1,
    // comissão descontada do repasse ao dono
    protection: {
      basica: { label: "Prote\xE7\xE3o b\xE1sica", perHour: 2.5, desc: "Danos, roubo e terceiros. Franquia de R$ 2.000." },
      completa: { label: "Prote\xE7\xE3o completa", perHour: 5.5, desc: "Tudo da b\xE1sica, com franquia zero e carro reserva." }
    },
    maxHours: 72
  };
  var USER = {
    name: "Marina Costa",
    short: "Marina",
    email: "marina@exemplo.com.br",
    phone: "(11) 9\u2022\u2022\u2022\u2022 4821",
    card: "Mastercard \u2022\u2022\u2022\u2022 4821",
    memberSince: "mar\xE7o de 2026",
    trips: 7,
    rating: 4.9
  };
  var PLACES = [
    { id: "pinheiros", name: "Pinheiros", sub: "S\xE3o Paulo, SP", lat: -23.5665, lng: -46.6915 },
    { id: "vilamadalena", name: "Vila Madalena", sub: "S\xE3o Paulo, SP", lat: -23.5535, lng: -46.6905 },
    { id: "paulista", name: "Avenida Paulista", sub: "Bela Vista, S\xE3o Paulo", lat: -23.5614, lng: -46.6559 },
    { id: "moema", name: "Moema", sub: "S\xE3o Paulo, SP", lat: -23.6004, lng: -46.6624 },
    { id: "itaim", name: "Itaim Bibi", sub: "S\xE3o Paulo, SP", lat: -23.5843, lng: -46.6793 },
    { id: "congonhas", name: "Aeroporto de Congonhas", sub: "Campo Belo, S\xE3o Paulo", lat: -23.6267, lng: -46.6554 }
  ];
  var CARS = [
    { id: "hb20", model: "Hyundai HB20", year: 2022, body: "hatch", price: 18, dailyCap: 140, transmission: "Manual", seats: 5, energy: "Flex", rating: 4.9, trips: 32, color: "#c9ccd1", colorName: "Prata", owner: "Carla M.", ownerSince: "2025", ownerResp: "~10 min", pickup: "Chave na portaria", street: "Rua dos Pinheiros", east: -120, north: 300 },
    { id: "mobi", model: "Fiat Mobi", year: 2021, body: "hatch", price: 12, dailyCap: 90, transmission: "Manual", seats: 5, energy: "Flex", rating: 4.8, trips: 41, color: "#f4f4f2", colorName: "Branco", owner: "Jorge A.", ownerSince: "2025", ownerResp: "~5 min", pickup: "Entrega em m\xE3os", street: "Rua Cardeal Arcoverde", east: 380, north: -330 },
    { id: "onix", model: "Chevrolet Onix", year: 2023, body: "sedan", price: 19, dailyCap: 150, transmission: "Autom\xE1tico", seats: 5, energy: "Flex", rating: 4.8, trips: 56, color: "#2b2d31", colorName: "Preto", owner: "Patr\xEDcia L.", ownerSince: "2024", ownerResp: "~15 min", pickup: "Chave na portaria", street: "Rua Teodoro Sampaio", east: -540, north: -260 },
    { id: "kwid", model: "Renault Kwid", year: 2022, body: "hatch", price: 13, dailyCap: 95, transmission: "Manual", seats: 5, energy: "Flex", rating: 4.7, trips: 18, color: "#d8792b", colorName: "Laranja", owner: "Bruno T.", ownerSince: "2025", ownerResp: "~20 min", pickup: "Entrega em m\xE3os", street: "Rua Fradique Coutinho", east: 560, north: 520 },
    { id: "polo", model: "Volkswagen Polo", year: 2023, body: "hatch", price: 21, dailyCap: 160, transmission: "Autom\xE1tico", seats: 5, energy: "Flex", rating: 5, trips: 12, color: "#c9ccd1", colorName: "Prata", owner: "Ana P.", ownerSince: "2026", ownerResp: "~10 min", pickup: "Cofre de chave", street: "Rua Artur de Azevedo", east: -860, north: 180 },
    { id: "dolphin", model: "BYD Dolphin", year: 2024, body: "hatch", price: 29, dailyCap: 220, transmission: "Autom\xE1tico", seats: 5, energy: "El\xE9trico", range: "290 km de autonomia", rating: 4.9, trips: 27, color: "#3d6e8f", colorName: "Azul", owner: "Rafael S.", ownerSince: "2024", ownerResp: "~5 min", pickup: "Cofre de chave", street: "Rua Mourato Coelho", east: 1050, north: 40 },
    { id: "tcross", model: "Volkswagen T-Cross", year: 2022, body: "suv", price: 26, dailyCap: 200, transmission: "Autom\xE1tico", seats: 5, energy: "Flex", rating: 4.9, trips: 38, color: "#f4f4f2", colorName: "Branco", owner: "Luiza F.", ownerSince: "2024", ownerResp: "~10 min", pickup: "Chave na portaria", street: "Rua Butant\xE3", east: 260, north: -1180 },
    { id: "pulse", model: "Fiat Pulse", year: 2023, body: "suv", price: 22, dailyCap: 170, transmission: "Autom\xE1tico", seats: 5, energy: "Flex", rating: 4.6, trips: 9, color: "#a33a2a", colorName: "Vermelho", owner: "Diego R.", ownerSince: "2026", ownerResp: "~30 min", pickup: "Entrega em m\xE3os", street: "Rua Capote Valente", east: -700, north: 1080, unavailable: true },
    { id: "corolla", model: "Toyota Corolla", year: 2022, body: "sedan", price: 32, dailyCap: 240, transmission: "Autom\xE1tico", seats: 5, energy: "H\xEDbrido", rating: 4.9, trips: 64, color: "#2b2d31", colorName: "Preto", owner: "Marcos V.", ownerSince: "2023", ownerResp: "~5 min", pickup: "Chave na portaria", street: "Avenida Pedroso de Morais", east: 1300, north: -620 },
    { id: "renegade", model: "Jeep Renegade", year: 2021, body: "suv", price: 27, dailyCap: 210, transmission: "Autom\xE1tico", seats: 5, energy: "Flex", rating: 4.7, trips: 22, color: "#6b6f55", colorName: "Verde-oliva", owner: "Helena C.", ownerSince: "2025", ownerResp: "~20 min", pickup: "Entrega em m\xE3os", street: "Rua Lisboa", east: -1500, north: -500, unavailable: true },
    { id: "kwide", model: "Renault Kwid E-Tech", year: 2023, body: "hatch", price: 24, dailyCap: 180, transmission: "Autom\xE1tico", seats: 4, energy: "El\xE9trico", range: "180 km de autonomia", rating: 4.8, trips: 11, color: "#e9e9e4", colorName: "Branco", owner: "Tiago N.", ownerSince: "2025", ownerResp: "~10 min", pickup: "Cofre de chave", street: "Rua Sim\xE3o \xC1lvares", east: 480, north: 1800 },
    { id: "hrv", model: "Honda HR-V", year: 2023, body: "suv", price: 34, dailyCap: 260, transmission: "Autom\xE1tico", seats: 5, energy: "Flex", rating: 4.8, trips: 15, color: "#8d9096", colorName: "Cinza", owner: "Sofia B.", ownerSince: "2024", ownerResp: "~15 min", pickup: "Chave na portaria", street: "Rua Joaquim Antunes", east: 1850, north: 950 }
  ];
  var REVIEWS = [
    { name: "Felipe R.", when: "setembro de 2026", stars: 5, text: "Carro limpo, chave na portaria como combinado. Peguei e devolvi sem falar com ningu\xE9m." },
    { name: "Juliana K.", when: "agosto de 2026", stars: 5, text: "Precisei por 3 horas para uma mudan\xE7a pequena. Saiu bem mais barato que um app de corrida." },
    { name: "Andr\xE9 M.", when: "agosto de 2026", stars: 4, text: "Tudo certo. S\xF3 o tanque estava um pouco abaixo do indicado, mas a dona resolveu na hora." }
  ];
  var RULES = [
    "Devolva com o mesmo n\xEDvel de combust\xEDvel ou carga",
    "Proibido fumar e transportar animais sem caixa",
    "Atraso na devolu\xE7\xE3o: R$ 15 a cada 15 min",
    "Cancelamento gr\xE1tis at\xE9 2 h antes da retirada"
  ];
  var MY_CAR = {
    id: "meu-creta",
    model: "Hyundai Creta",
    year: 2022,
    body: "suv",
    price: 25,
    dailyCap: 190,
    transmission: "Autom\xE1tico",
    seats: 5,
    energy: "Flex",
    rating: 4.9,
    trips: 23,
    color: "#4a5560",
    colorName: "Grafite",
    owner: "Marina C.",
    ownerSince: "2026",
    ownerResp: "~10 min",
    pickup: "Cofre de chave",
    street: "Rua Ferreira de Ara\xFAjo",
    east: -260,
    north: -720,
    mine: true,
    active: true
  };
  var EARNINGS_WEEKS = [182, 240, 196, 318, 274, 352, 298, 410];
  var OWNER_UPCOMING = [
    { who: "Rodrigo P.", rating: 4.9, day: 0, start: 18, hours: 3 },
    { who: "Beatriz S.", rating: 5, day: 1, start: 9, hours: 6 },
    { who: "Caio M.", rating: 4.8, day: 3, start: 14, hours: 24 }
  ];
  var PAST_TRIPS = [
    { id: "GR-8K2P", carId: "polo", daysAgo: 9, startHour: 10, hours: 5, total: 132.55, rated: 5 },
    { id: "GR-3M7Q", carId: "mobi", daysAgo: 23, startHour: 19, hours: 3, total: 47.85, rated: 5 }
  ];
  var MODELS = [
    { model: "Chevrolet Onix", body: "sedan", suggest: [17, 21] },
    { model: "Fiat Argo", body: "hatch", suggest: [15, 19] },
    { model: "Fiat Mobi", body: "hatch", suggest: [11, 14] },
    { model: "Honda Civic", body: "sedan", suggest: [26, 32] },
    { model: "Hyundai HB20", body: "hatch", suggest: [16, 20] },
    { model: "Jeep Compass", body: "suv", suggest: [30, 38] },
    { model: "Renault Kwid", body: "hatch", suggest: [12, 15] },
    { model: "Toyota Corolla", body: "sedan", suggest: [28, 34] },
    { model: "Toyota Yaris", body: "hatch", suggest: [18, 22] },
    { model: "Volkswagen Gol", body: "hatch", suggest: [13, 16] },
    { model: "Volkswagen Nivus", body: "suv", suggest: [23, 28] },
    { model: "Volkswagen T-Cross", body: "suv", suggest: [24, 29] }
  ];
  var COLORS = [
    { name: "Branco", hex: "#f4f4f2" },
    { name: "Prata", hex: "#c9ccd1" },
    { name: "Cinza", hex: "#8d9096" },
    { name: "Preto", hex: "#2b2d31" },
    { name: "Vermelho", hex: "#a33a2a" },
    { name: "Azul", hex: "#3d6e8f" }
  ];

  // src/explore.jsx
  var { useState: useState3, useMemo: useMemo2, useEffect: useEffect3 } = React;
  var FILTERS = [
    { id: "price", label: "At\xE9 R$ 20/h", test: (c) => c.price <= 20 },
    { id: "auto", label: "Autom\xE1tico", test: (c) => c.transmission === "Autom\xE1tico" },
    { id: "ev", label: "El\xE9trico", icon: "zap", test: (c) => c.energy === "El\xE9trico" },
    { id: "suv", label: "SUV", test: (c) => c.body === "suv" },
    { id: "top", label: "Nota 4,8+", icon: "star", test: (c) => c.rating >= 4.8 }
  ];
  function Explore({ app }) {
    const { state, nav, cars, place, H } = app;
    const [active, setActive] = useState3({});
    const [selId, setSelId] = useState3(null);
    const [open, setOpen] = useState3(false);
    const [focus, setFocus] = useState3(null);
    const visible = useMemo2(() => cars.filter((c) => FILTERS.every((f) => !active[f.id] || f.test(c))).sort((a, b) => (a.unavailable ? 1 : 0) - (b.unavailable ? 1 : 0) || a.distance - b.distance), [cars, active]);
    const available = visible.filter((c) => !c.unavailable).length;
    const sel = visible.find((c) => c.id === selId) || null;
    const start = startOf(state.search);
    const when = rangeText(start, state.search.hours);
    const PEEK = 268, PREVIEW = 246, OPEN = Math.round((H - 64) * 0.86);
    const sheetH = sel ? PREVIEW : open ? OPEN : PEEK;
    const padding = { top: sel ? 92 : 136, bottom: sheetH, left: 0, right: 0 };
    useEffect3(() => {
      const onKey = (e) => {
        if (e.key === "Escape") setSelId(null);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);
    useEffect3(() => {
      setSelId(null);
    }, [place.id]);
    useEffect3(() => {
      const req = app.focusReq;
      const c = req && cars.find((x) => x.id === req.id);
      if (!c) return;
      setSelId(c.id);
      setOpen(false);
      setFocus({ lat: c.pos.lat, lng: c.pos.lng, at: Date.now() });
    }, [app.focusReq && app.focusReq.at]);
    function select(id) {
      const next = id === selId ? null : id;
      setSelId(next);
      setOpen(false);
      if (next) {
        const c = cars.find((x) => x.id === next);
        setFocus({ lat: c.pos.lat, lng: c.pos.lng, at: Date.now() });
      }
    }
    function locate() {
      const go = (p) => setFocus({ lat: p.lat, lng: p.lng, zoom: 15, at: Date.now() });
      if (!navigator.geolocation) return go(place);
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const me = { lat: p.coords.latitude, lng: p.coords.longitude };
          app.setMe(me);
          go(me);
        },
        () => {
          app.toast("Sem acesso \xE0 localiza\xE7\xE3o. Mostrando " + place.name + ".");
          go(place);
        },
        { enableHighAccuracy: true, timeout: 8e3, maximumAge: 6e4 }
      );
    }
    const count = Object.values(active).filter(Boolean).length;
    let sheet;
    if (sel) {
      const price = G.calcPrice({ rate: sel.price, hours: state.search.hours, dailyCap: sel.dailyCap, protectionPerHour: CONFIG.protection.basica.perHour, feeRate: CONFIG.feeRate });
      sheet = /* @__PURE__ */ React.createElement(G.BottomSheet, { className: "explore-sheet", ariaLabel: sel.model, style: { height: sheetH } }, /* @__PURE__ */ React.createElement(G.IconButton, { className: "sheet-close", icon: "x", size: "sm", label: "Fechar", onClick: () => setSelId(null) }), /* @__PURE__ */ React.createElement(G.CarCard, { car: sel, onClick: () => nav.push("car", { id: sel.id }) }), /* @__PURE__ */ React.createElement("div", { className: "preview-foot" }, /* @__PURE__ */ React.createElement("div", { className: "preview-total" }, /* @__PURE__ */ React.createElement("span", { className: "preview-total-value" }, sel.unavailable ? "Indispon\xEDvel" : brl(price.total)), /* @__PURE__ */ React.createElement("span", { className: "preview-total-sub" }, sel.unavailable ? "nesse hor\xE1rio" : `total por ${hoursText(state.search.hours)}`)), /* @__PURE__ */ React.createElement(G.Button, { size: "lg", onClick: () => nav.push("car", { id: sel.id }) }, "Ver carro")));
    } else {
      sheet = /* @__PURE__ */ React.createElement(
        G.BottomSheet,
        {
          className: "explore-sheet",
          title: available === 0 ? "Nenhum carro dispon\xEDvel" : available === 1 ? "1 carro dispon\xEDvel" : `${available} carros dispon\xEDveis`,
          subtitle: "Pre\xE7o por hora \xB7 mais pr\xF3ximos primeiro",
          onGrab: () => setOpen(!open),
          expanded: open,
          grabLabel: open ? "Recolher lista" : "Expandir lista",
          action: /* @__PURE__ */ React.createElement(G.IconButton, { icon: open ? "map" : "list", label: open ? "Ver mapa" : "Ver lista", onClick: () => setOpen(!open) }),
          style: { height: sheetH }
        },
        visible.length ? visible.map((c) => /* @__PURE__ */ React.createElement(G.CarCard, { key: c.id, car: c, onClick: () => nav.push("car", { id: c.id }) })) : /* @__PURE__ */ React.createElement("div", { className: "empty" }, /* @__PURE__ */ React.createElement("p", null, "Nenhum carro com esses filtros por aqui."), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", onClick: () => setActive({}) }, "Limpar filtros"))
      );
    }
    return /* @__PURE__ */ React.createElement("div", { className: "explore", style: { "--sheet-h": sheetH + 64 + "px" } }, /* @__PURE__ */ React.createElement(
      MapView,
      {
        center: place,
        theme: app.theme,
        cars: visible,
        selectedId: sel && sel.id,
        me: app.me,
        onSelect: select,
        onBlank: () => setSelId(null),
        focus,
        padding
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "explore-top" }, /* @__PURE__ */ React.createElement(G.SearchBar, { place: place.name, when: `${when} \xB7 ${hoursText(state.search.hours)}`, onSearch: () => nav.push("search") }), /* @__PURE__ */ React.createElement("div", { className: "chips", hidden: !!sel, role: "group", "aria-label": "Filtros" + (count ? ` (${count} ativos)` : "") }, FILTERS.map((f) => /* @__PURE__ */ React.createElement(G.Chip, { key: f.id, icon: f.icon, floating: true, selected: !!active[f.id], onClick: () => setActive((a) => ({ ...a, [f.id]: !a[f.id] })) }, f.label)))), /* @__PURE__ */ React.createElement(G.IconButton, { className: cx("locate", open && "is-hidden"), icon: "locate-fixed", label: "Centralizar no meu local", variant: "floating", onClick: locate }), sheet);
  }
  function Search({ app }) {
    const { state, nav } = app;
    const [placeId, setPlaceId] = useState3(state.search.placeId);
    const [dayOffset, setDayOffset] = useState3(state.search.dayOffset);
    const [startHour, setStartHour] = useState3(state.search.startHour);
    const [hours, setHours] = useState3(state.search.hours);
    const [q, setQ] = useState3("");
    const minHour = dayOffset === 0 ? nextHour() : 0;
    useEffect3(() => {
      if (startHour < minHour) setStartHour(minHour);
    }, [dayOffset]);
    const days = [0, 1, 2, 3, 4, 5, 6].filter((d) => d > 0 || nextHour() <= 23);
    const hoursList = [];
    for (let h = minHour; h <= 23; h++) hoursList.push(h);
    const places = PLACES.filter((p) => (p.name + " " + p.sub).toLowerCase().includes(q.trim().toLowerCase()));
    const start = addHours(today0(), dayOffset * 24 + startHour);
    function apply() {
      app.setSearch({ placeId, dayOffset, startHour, hours });
      nav.pop();
    }
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: "Onde e quando", onBack: nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "search-field" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "search", size: 20 }), /* @__PURE__ */ React.createElement("input", { type: "search", placeholder: "Bairro, endere\xE7o ou aeroporto", value: q, onChange: (e) => setQ(e.target.value), "aria-label": "Buscar local" })), /* @__PURE__ */ React.createElement("div", { className: "place-list", role: "radiogroup", "aria-label": "Local" }, places.map((p) => /* @__PURE__ */ React.createElement("button", { key: p.id, type: "button", role: "radio", "aria-checked": p.id === placeId, className: cx("place", p.id === placeId && "place-on"), onClick: () => setPlaceId(p.id) }, /* @__PURE__ */ React.createElement("span", { className: "row-icon" }, /* @__PURE__ */ React.createElement(G.Icon, { name: p.id === "congonhas" ? "navigation" : "map-pin", size: 20 })), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, p.name), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, p.sub)), p.id === placeId ? /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 20, className: "place-check" }) : null)), !places.length ? /* @__PURE__ */ React.createElement("p", { className: "muted pad" }, "Nenhum local encontrado. Tente outro bairro.") : null), /* @__PURE__ */ React.createElement("h2", { className: "label-title" }, "Dia"), /* @__PURE__ */ React.createElement("div", { className: "hscroll" }, days.map((d) => /* @__PURE__ */ React.createElement(G.Chip, { key: d, selected: d === dayOffset, onClick: () => setDayOffset(d) }, dayLabel(addHours(today0(), d * 24 + 12))))), /* @__PURE__ */ React.createElement("h2", { className: "label-title" }, "Retirada"), /* @__PURE__ */ React.createElement("div", { className: "hscroll" }, hoursList.map((h) => /* @__PURE__ */ React.createElement(G.Chip, { key: h, selected: h === startHour, onClick: () => setStartHour(h) }, String(h).padStart(2, "0"), ":00"))), /* @__PURE__ */ React.createElement("h2", { className: "label-title" }, "Dura\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "hscroll" }, [2, 4, 8, 24, 48].map((h) => /* @__PURE__ */ React.createElement(G.Chip, { key: h, selected: h === hours, onClick: () => setHours(h) }, hoursText(h)))), /* @__PURE__ */ React.createElement("div", { className: "pad-x" }, /* @__PURE__ */ React.createElement(G.Stepper, { label: "Ajuste fino", hint: rangeText(start, hours), value: hours, min: 1, max: CONFIG.maxHours, onChange: setHours, format: hoursText }))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, onClick: apply }, "Ver carros")));
  }

  // src/booking.jsx
  var { useState: useState4, useEffect: useEffect4 } = React;
  function priceFor(car, hours, protection) {
    const p = CONFIG.protection[protection || "basica"];
    const r = G.calcPrice({ rate: car.price, hours, dailyCap: car.dailyCap, protectionPerHour: p.perHour, feeRate: CONFIG.feeRate });
    r.items = r.items.map((it) => it.label === "Prote\xE7\xE3o b\xE1sica" ? { label: p.label, value: it.value } : it);
    return r;
  }
  function CarDetail({ app, params }) {
    const { nav, state } = app;
    const car = app.carById(params.id);
    const [hours, setHours] = useState4(state.search.hours);
    const fav = state.favorites.includes(car.id);
    const price = priceFor(car, hours, "basica");
    const start = startOf(state.search);
    const features = [
      { icon: "cog", label: car.transmission },
      { icon: "users", label: car.seats + " lugares" },
      { icon: car.energy === "El\xE9trico" ? "zap" : "fuel", label: car.range || car.energy },
      { icon: "key-round", label: car.pickup }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "hero" }, /* @__PURE__ */ React.createElement(TopBar, { transparent: true, onBack: nav.pop, right: /* @__PURE__ */ React.createElement(G.IconButton, { variant: "floating", icon: "star", label: fav ? "Remover dos favoritos" : "Salvar nos favoritos", onClick: () => {
      app.toggleFav(car.id);
      app.toast(fav ? "Removido dos favoritos" : "Salvo nos favoritos");
    }, className: fav ? "fav-on" : "" }) }), /* @__PURE__ */ React.createElement(CarArt, { car, className: "hero-art" }), /* @__PURE__ */ React.createElement("span", { className: "hero-tag" }, car.colorName, " \xB7 ", car.year)), /* @__PURE__ */ React.createElement("div", { className: "pad" }, /* @__PURE__ */ React.createElement("h1", { className: "car-title" }, car.model, " ", /* @__PURE__ */ React.createElement("span", { className: "muted" }, car.year)), /* @__PURE__ */ React.createElement("p", { className: "car-sub" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "star", size: 15, filled: true, strokeWidth: 0 }), " ", G.formatRating(car.rating), " \xB7 ", car.trips, " viagens \xB7 ", G.formatDistance(car.distance), " de voc\xEA"), /* @__PURE__ */ React.createElement("div", { className: "badges" }, car.mine ? /* @__PURE__ */ React.createElement(G.Badge, { tone: "accent", icon: "key-round" }, "Seu an\xFAncio") : car.unavailable ? /* @__PURE__ */ React.createElement(G.Badge, { tone: "danger", icon: "clock" }, "Indispon\xEDvel nesse hor\xE1rio") : /* @__PURE__ */ React.createElement(G.Badge, { tone: "accent", icon: "badge-check" }, "Confirma\xE7\xE3o na hora"), /* @__PURE__ */ React.createElement(G.Badge, { icon: "shield-check" }, "Prote\xE7\xE3o inclu\xEDda"))), /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement("ul", { className: "features" }, features.map((f) => /* @__PURE__ */ React.createElement("li", { key: f.label }, /* @__PURE__ */ React.createElement(G.Icon, { name: f.icon, size: 20 }), /* @__PURE__ */ React.createElement("span", null, f.label))))), /* @__PURE__ */ React.createElement(Section, { title: "Anfitri\xE3 ou anfitri\xE3o" }, /* @__PURE__ */ React.createElement("div", { className: "host" }, /* @__PURE__ */ React.createElement(Avatar, { name: car.owner, size: 48 }), /* @__PURE__ */ React.createElement("div", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, car.owner), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, "No Giro desde ", car.ownerSince, " \xB7 responde em ", car.ownerResp)), /* @__PURE__ */ React.createElement(G.Icon, { name: "badge-check", size: 22, title: "Identidade verificada", style: { color: "var(--accent-ink)" } }))), /* @__PURE__ */ React.createElement(Section, { title: "Retirada e devolu\xE7\xE3o" }, /* @__PURE__ */ React.createElement(Row, { icon: "map-pin", label: car.street, sub: "Endere\xE7o exato liberado ap\xF3s a reserva" }), /* @__PURE__ */ React.createElement(Row, { icon: "key-round", label: car.pickup, sub: car.pickup === "Cofre de chave" ? "C\xF3digo do cofre enviado no app" : car.pickup === "Chave na portaria" ? "Avise na portaria que \xE9 reserva Giro" : "Combine o hor\xE1rio pelo chat" })), /* @__PURE__ */ React.createElement(Section, { title: "Dura\xE7\xE3o" }, /* @__PURE__ */ React.createElement(G.Stepper, { label: "Horas", hint: rangeText(start, hours), value: hours, min: 1, max: CONFIG.maxHours, onChange: setHours, format: hoursText }), /* @__PURE__ */ React.createElement("p", { className: "note" }, "Di\xE1ria m\xE1xima de ", brl0(car.dailyCap), ": a partir de ", Math.ceil(car.dailyCap / car.price), " h no mesmo dia, voc\xEA paga s\xF3 a di\xE1ria.")), /* @__PURE__ */ React.createElement(Section, { title: `Avalia\xE7\xF5es \xB7 ${G.formatRating(car.rating)}` }, REVIEWS.map((r) => /* @__PURE__ */ React.createElement("div", { className: "review", key: r.name }, /* @__PURE__ */ React.createElement("div", { className: "review-head" }, /* @__PURE__ */ React.createElement(Avatar, { name: r.name, size: 32 }), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, r.name), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, r.when)), /* @__PURE__ */ React.createElement(Stars, { value: r.stars, size: 12 })), /* @__PURE__ */ React.createElement("p", null, r.text)))), /* @__PURE__ */ React.createElement(Section, { title: "Regras" }, /* @__PURE__ */ React.createElement("ul", { className: "rules" }, RULES.map((r) => /* @__PURE__ */ React.createElement("li", { key: r }, /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 16 }), r))))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot foot-split" }, /* @__PURE__ */ React.createElement("div", { className: "foot-price" }, /* @__PURE__ */ React.createElement("span", { className: "foot-price-main" }, brl0(car.price), /* @__PURE__ */ React.createElement("span", { className: "muted" }, " /hora")), /* @__PURE__ */ React.createElement("span", { className: "foot-price-sub" }, brl(price.total), " por ", hoursText(hours))), car.mine ? /* @__PURE__ */ React.createElement(G.Button, { size: "lg", variant: "secondary", onClick: () => nav.tab("host") }, "Editar an\xFAncio") : /* @__PURE__ */ React.createElement(G.Button, { size: "lg", disabled: car.unavailable, variant: car.unavailable ? "secondary" : "primary", onClick: () => {
      app.setSearch({ ...state.search, hours });
      nav.push("checkout", { id: car.id });
    } }, car.unavailable ? "Indispon\xEDvel" : "Reservar")));
  }
  function Checkout({ app, params }) {
    const { nav, state } = app;
    const car = app.carById(params.id);
    const [protection, setProtection] = useState4("basica");
    const [payment, setPayment] = useState4("pix");
    const hours = state.search.hours;
    const start = startOf(state.search);
    const price = priceFor(car, hours, protection);
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: "Confirmar e pagar", onBack: nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "pad checkout-car" }, /* @__PURE__ */ React.createElement("span", { className: "car-thumb car-thumb-lg" }, /* @__PURE__ */ React.createElement(CarArt, { car, ground: false })), /* @__PURE__ */ React.createElement("div", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label strong" }, car.model, " ", car.year), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, car.owner, " \xB7 ", G.formatRating(car.rating), " \u2605"), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, rangeText(start, hours)))), /* @__PURE__ */ React.createElement(Section, { title: "Prote\xE7\xE3o" }, Object.entries(CONFIG.protection).map(([k, p]) => /* @__PURE__ */ React.createElement(Radio, { key: k, name: "protection", checked: protection === k, onChange: () => setProtection(k), label: p.label, sub: p.desc, right: k === "basica" ? "Inclu\xEDda" : "+" + brl(p.perHour - CONFIG.protection.basica.perHour) + "/h" }))), /* @__PURE__ */ React.createElement(Section, { title: "Pagamento" }, /* @__PURE__ */ React.createElement(Radio, { name: "pay", checked: payment === "pix", onChange: () => setPayment("pix"), label: "Pix", sub: "Aprova\xE7\xE3o na hora", right: /* @__PURE__ */ React.createElement(G.Badge, { tone: "accent" }, "Recomendado") }), /* @__PURE__ */ React.createElement(Radio, { name: "pay", checked: payment === "card", onChange: () => setPayment("card"), label: "Cart\xE3o de cr\xE9dito", sub: USER.card })), /* @__PURE__ */ React.createElement(Section, { title: "Resumo" }, /* @__PURE__ */ React.createElement(G.PriceSummary, { items: price.items, total: price.total, note: `Cobran\xE7a s\xF3 depois que ${firstName(car.owner)} confirmar. Cancelamento gr\xE1tis at\xE9 2 h antes.` })), /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Row, { icon: "badge-check", tone: "accent", label: "CNH verificada", sub: `${USER.name} \xB7 categoria B` }))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, onClick: () => nav.push("pay", { id: car.id, protection, payment, total: price.total }) }, payment === "pix" ? "Pagar com Pix" : "Pagar com cart\xE3o", " \xB7 ", brl(price.total))));
  }
  function Pay({ app, params }) {
    const { nav, state } = app;
    const car = app.carById(params.id);
    const [phase, setPhase] = useState4(params.payment === "pix" ? "waiting" : "processing");
    const now = useNow(1e3);
    const [deadline] = useState4(Date.now() + 10 * 6e4);
    function finish() {
      if (phase === "approved") return;
      setPhase("approved");
      const booking = {
        id: code(),
        carId: car.id,
        start: startOf(state.search).toISOString(),
        hours: state.search.hours,
        protection: params.protection,
        payment: params.payment,
        total: params.total,
        status: "confirmada",
        createdAt: Date.now()
      };
      setTimeout(() => {
        app.addBooking(booking);
        nav.replace("confirmed", { bookingId: booking.id });
      }, 900);
    }
    useEffect4(() => {
      const t = setTimeout(finish, phase === "processing" ? 1800 : 7e3);
      return () => clearTimeout(t);
    }, []);
    const left = Math.max(0, deadline - now), mm = Math.floor(left / 6e4), ss = Math.floor(left % 6e4 / 1e3);
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: params.payment === "pix" ? "Pagamento via Pix" : "Pagamento", onBack: phase === "approved" ? null : nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll pay" }, params.payment === "pix" && phase !== "approved" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "pay-amount" }, brl(params.total)), /* @__PURE__ */ React.createElement("p", { className: "muted center" }, "Escaneie o QR no app do seu banco ou copie o c\xF3digo."), /* @__PURE__ */ React.createElement("div", { className: "qr-wrap" }, /* @__PURE__ */ React.createElement(DemoQR, { seed: car.id.length * 97 }), /* @__PURE__ */ React.createElement("span", { className: "qr-demo" }, "Demonstra\xE7\xE3o")), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", block: true, icon: "copy", onClick: () => app.toast("C\xF3digo Pix copiado") }, "Copiar c\xF3digo Pix"), /* @__PURE__ */ React.createElement("div", { className: "waiting", role: "status" }, /* @__PURE__ */ React.createElement("span", { className: "spinner", "aria-hidden": "true" }), "Aguardando pagamento \xB7 expira em ", mm, ":", String(ss).padStart(2, "0")), /* @__PURE__ */ React.createElement(G.Button, { variant: "ghost", block: true, onClick: finish }, "J\xE1 paguei")) : /* @__PURE__ */ React.createElement("div", { className: "pay-status", role: "status" }, phase === "approved" ? /* @__PURE__ */ React.createElement("span", { className: "big-check" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 40, strokeWidth: 2.25 })) : /* @__PURE__ */ React.createElement("span", { className: "spinner spinner-lg", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("p", { className: "pay-status-title" }, phase === "approved" ? "Pagamento aprovado" : "Processando pagamento"), /* @__PURE__ */ React.createElement("p", { className: "muted center" }, phase === "approved" ? `Enviando a reserva para ${firstName(car.owner)}\u2026` : USER.card))));
  }
  function Confirmed({ app, params }) {
    const { nav } = app;
    const b = app.bookingById(params.bookingId);
    const car = app.carById(b.carId);
    const start = new Date(b.start);
    return /* @__PURE__ */ React.createElement("div", { className: "screen confirmed" }, /* @__PURE__ */ React.createElement("div", { className: "scroll pad" }, /* @__PURE__ */ React.createElement("div", { className: "confirmed-hero" }, /* @__PURE__ */ React.createElement("span", { className: "big-check" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 40, strokeWidth: 2.25 })), /* @__PURE__ */ React.createElement("h1", { className: "display" }, "Reserva confirmada"), /* @__PURE__ */ React.createElement("p", { className: "muted" }, firstName(car.owner), " aceitou seu pedido. C\xF3digo ", /* @__PURE__ */ React.createElement("strong", { className: "code" }, b.id))), /* @__PURE__ */ React.createElement(CarArt, { car, className: "confirmed-art" }), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement(Row, { icon: "calendar", label: longDate(start), sub: `${hhmm(start)} \u2013 ${hhmm(addHours(start, b.hours))} \xB7 ${hoursText(b.hours)}` }), /* @__PURE__ */ React.createElement(Row, { icon: "map-pin", label: car.street, sub: car.pickup }), /* @__PURE__ */ React.createElement(Row, { icon: "shield-check", label: CONFIG.protection[b.protection].label, sub: (b.payment === "pix" ? "Pago com Pix" : "Pago com cart\xE3o") + " \xB7 " + brl(b.total) }))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot stack" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, onClick: () => nav.replace("booking", { bookingId: b.id }) }, "Ver reserva"), /* @__PURE__ */ React.createElement(G.Button, { variant: "ghost", block: true, onClick: () => nav.home("explore") }, "Voltar ao mapa")));
  }

  // src/trips.jsx
  var { useState: useState5, useEffect: useEffect5, useRef: useRef3 } = React;
  var STATUS = {
    confirmada: { label: "Confirmada", tone: "accent", icon: "check" },
    andamento: { label: "Em andamento", tone: "accent", icon: "car" },
    concluida: { label: "Conclu\xEDda", tone: "neutral", icon: "check" },
    cancelada: { label: "Cancelada", tone: "danger", icon: "x" }
  };
  function Trips({ app }) {
    const { nav } = app;
    const [tab, setTab] = useState5("next");
    const all = app.bookings();
    const next = all.filter((b) => b.status === "confirmada" || b.status === "andamento");
    const past = all.filter((b) => b.status === "concluida" || b.status === "cancelada");
    const list = tab === "next" ? next : past;
    return /* @__PURE__ */ React.createElement("div", { className: "screen tab-screen" }, /* @__PURE__ */ React.createElement("header", { className: "tab-head" }, /* @__PURE__ */ React.createElement("h1", { className: "display" }, "Viagens")), /* @__PURE__ */ React.createElement("div", { className: "segmented", role: "tablist" }, /* @__PURE__ */ React.createElement("button", { role: "tab", "aria-selected": tab === "next", onClick: () => setTab("next") }, "Pr\xF3ximas", next.length ? ` \xB7 ${next.length}` : ""), /* @__PURE__ */ React.createElement("button", { role: "tab", "aria-selected": tab === "past", onClick: () => setTab("past") }, "Anteriores")), /* @__PURE__ */ React.createElement("div", { className: "scroll pad" }, list.length ? list.map((b) => /* @__PURE__ */ React.createElement(TripCard, { key: b.id, app, b })) : /* @__PURE__ */ React.createElement("div", { className: "empty-big" }, /* @__PURE__ */ React.createElement("span", { className: "empty-icon" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "calendar", size: 28 })), /* @__PURE__ */ React.createElement("p", { className: "row-label" }, tab === "next" ? "Nenhuma viagem marcada" : "Nenhuma viagem ainda"), /* @__PURE__ */ React.createElement("p", { className: "muted" }, "Carros de vizinhos a partir de R$ 12 por hora."), /* @__PURE__ */ React.createElement(G.Button, { onClick: () => nav.tab("explore") }, "Encontrar um carro"))));
  }
  function TripCard({ app, b }) {
    const car = app.carById(b.carId);
    const start = new Date(b.start), s = STATUS[b.status];
    return /* @__PURE__ */ React.createElement("button", { type: "button", className: "trip", onClick: () => app.nav.push("booking", { bookingId: b.id }) }, /* @__PURE__ */ React.createElement("span", { className: "car-thumb car-thumb-lg" }, /* @__PURE__ */ React.createElement(CarArt, { car, ground: false })), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label strong" }, car.model), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, dayLabel(start), " \xB7 ", hhmm(start), " \u2013 ", hhmm(addHours(start, b.hours))), /* @__PURE__ */ React.createElement("span", { className: "trip-meta" }, /* @__PURE__ */ React.createElement(G.Badge, { tone: s.tone, icon: s.icon }, s.label), /* @__PURE__ */ React.createElement("span", { className: "muted" }, brl(b.total)))), /* @__PURE__ */ React.createElement(G.Icon, { name: "chevron-right", size: 18, className: "row-chev" }));
  }
  function Booking({ app, params }) {
    const { nav } = app;
    const b = app.bookingById(params.bookingId);
    const car = app.carById(b.carId);
    const now = useNow(1e3);
    const [locked, setLocked] = useState5(true);
    const [confirmCancel, setConfirmCancel] = useState5(false);
    const start = new Date(b.start), end = addHours(start, b.hours);
    const steps = ["confirmada", "vistoria", "andamento", "concluida"];
    const idx = b.status === "cancelada" ? -1 : b.status === "andamento" ? 2 : b.status === "concluida" ? 3 : 0;
    let live = null;
    if (b.status === "andamento") {
      const from = Math.min(start.getTime(), b.startedAt), endAt = end.getTime(), left = Math.max(0, endAt - now);
      const h = Math.floor(left / 36e5), m = Math.floor(left % 36e5 / 6e4), sec = Math.floor(left % 6e4 / 1e3);
      const pct = Math.max(2, Math.min(100, (now - from) / (endAt - from) * 100));
      live = /* @__PURE__ */ React.createElement("div", { className: "live" }, /* @__PURE__ */ React.createElement("span", { className: "live-label" }, "Devolu\xE7\xE3o \xE0s ", hhmm(new Date(endAt))), /* @__PURE__ */ React.createElement("span", { className: "live-time" }, h ? `${h} h ` : "", String(m).padStart(2, "0"), " min ", String(sec).padStart(2, "0"), " s"), /* @__PURE__ */ React.createElement("span", { className: "live-bar" }, /* @__PURE__ */ React.createElement("span", { style: { width: pct + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "live-actions" }, /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", icon: locked ? "lock-open" : "lock", onClick: () => {
        setLocked(!locked);
        app.toast(locked ? "Carro destrancado" : "Carro trancado");
      } }, locked ? "Destrancar" : "Trancar"), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", icon: "navigation", onClick: () => app.toast("Abrindo rota no seu app de mapas") }, "Rota")));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: "Sua reserva", sub: b.id, onBack: nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "pad booking-head" }, /* @__PURE__ */ React.createElement(CarArt, { car, className: "booking-art" }), /* @__PURE__ */ React.createElement("h2", { className: "car-title" }, car.model, " ", /* @__PURE__ */ React.createElement("span", { className: "muted" }, car.year)), /* @__PURE__ */ React.createElement(G.Badge, { tone: STATUS[b.status].tone, icon: STATUS[b.status].icon }, STATUS[b.status].label)), live, b.status !== "cancelada" ? /* @__PURE__ */ React.createElement("ol", { className: "timeline", "aria-label": "Etapas da reserva" }, ["Reservada", "Vistoria", "Em uso", "Devolvida"].map((t, i) => /* @__PURE__ */ React.createElement("li", { key: t, className: cx(i <= idx && "done", i === idx + 1 && "next") }, /* @__PURE__ */ React.createElement("span", { className: "tl-dot" }), t))) : null, /* @__PURE__ */ React.createElement(Section, { title: "Detalhes" }, /* @__PURE__ */ React.createElement(Row, { icon: "calendar", label: longDate(start), sub: `${hhmm(start)} \u2013 ${dayLabel(end, true) === "hoje" || start.toDateString() === end.toDateString() ? "" : dayLabel(end, true) + " "}${hhmm(end)} \xB7 ${hoursText(b.hours)}` }), /* @__PURE__ */ React.createElement(Row, { icon: "map-pin", label: car.street + ", 412", sub: car.pickup + (car.pickup === "Cofre de chave" ? " \xB7 c\xF3digo 4 8 1 7" : "") }), /* @__PURE__ */ React.createElement(Row, { icon: "shield-check", label: CONFIG.protection[b.protection].label, sub: CONFIG.protection[b.protection].desc }), /* @__PURE__ */ React.createElement(Row, { icon: b.payment === "pix" ? "wallet" : "credit-card", label: brl(b.total), sub: b.status === "cancelada" ? "Reembolso integral enviado" : b.payment === "pix" ? "Pago com Pix" : "Pago com cart\xE3o" })), /* @__PURE__ */ React.createElement(Section, { title: "Anfitri\xE3 ou anfitri\xE3o" }, /* @__PURE__ */ React.createElement("div", { className: "host" }, /* @__PURE__ */ React.createElement(Avatar, { name: car.owner, size: 44 }), /* @__PURE__ */ React.createElement("div", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, car.owner), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, "Responde em ", car.ownerResp)), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", icon: "message-circle", onClick: () => nav.push("chat", { bookingId: b.id }) }, "Mensagem"))), b.status === "concluida" && b.rated ? /* @__PURE__ */ React.createElement(Section, { title: "Sua avalia\xE7\xE3o" }, /* @__PURE__ */ React.createElement("div", { className: "rated" }, /* @__PURE__ */ React.createElement(Stars, { value: b.rated, size: 18 }), /* @__PURE__ */ React.createElement("span", { className: "muted" }, "Obrigado por avaliar"))) : null, b.status === "confirmada" ? /* @__PURE__ */ React.createElement("div", { className: "pad" }, confirmCancel ? /* @__PURE__ */ React.createElement("div", { className: "confirm-box" }, /* @__PURE__ */ React.createElement("p", { className: "row-label" }, "Cancelar esta reserva?"), /* @__PURE__ */ React.createElement("p", { className: "muted" }, "Faltam mais de 2 horas: voc\xEA recebe ", brl(b.total), " de volta."), /* @__PURE__ */ React.createElement("div", { className: "row-actions" }, /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", onClick: () => setConfirmCancel(false) }, "Manter"), /* @__PURE__ */ React.createElement(G.Button, { variant: "ghost", className: "danger-text", onClick: () => {
      app.updateBooking(b.id, { status: "cancelada" });
      setConfirmCancel(false);
      app.toast("Reserva cancelada. Reembolso a caminho.");
    } }, "Cancelar reserva"))) : /* @__PURE__ */ React.createElement(G.Button, { variant: "ghost", className: "danger-text", onClick: () => setConfirmCancel(true) }, "Cancelar reserva")) : null), b.status === "confirmada" ? /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, icon: "camera", onClick: () => nav.push("inspection", { bookingId: b.id }) }, "Fazer vistoria e retirar")) : b.status === "andamento" ? /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, onClick: () => nav.push("rate", { bookingId: b.id }) }, "Encerrar e devolver")) : b.status === "concluida" && !b.rated ? /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, onClick: () => nav.push("rate", { bookingId: b.id }) }, "Avaliar viagem")) : null);
  }
  var SHOTS = ["Frente", "Traseira", "Lado esquerdo", "Lado direito"];
  function Inspection({ app, params }) {
    const { nav } = app;
    const b = app.bookingById(params.bookingId);
    const car = app.carById(b.carId);
    const [done, setDone] = useState5({});
    const [fuel, setFuel] = useState5(null);
    const [ok, setOk] = useState5(false);
    const n = Object.values(done).filter(Boolean).length;
    const ready = n === SHOTS.length && fuel && ok;
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: "Vistoria de retirada", sub: `${n} de ${SHOTS.length} fotos`, onBack: nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll pad" }, /* @__PURE__ */ React.createElement("p", { className: "muted" }, "Fotografe o carro antes de sair. As fotos protegem voc\xEA e ", firstName(car.owner), " em caso de dano."), /* @__PURE__ */ React.createElement("div", { className: "shots" }, SHOTS.map((s, i) => /* @__PURE__ */ React.createElement("button", { key: s, type: "button", className: cx("shot", done[s] && "shot-done"), onClick: () => setDone((d) => ({ ...d, [s]: true })), "aria-label": (done[s] ? "Refazer foto: " : "Tirar foto: ") + s }, done[s] ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CarArt, { car, ground: false, className: cx("shot-art", i === 1 && "flip", i >= 2 && "zoom") }), /* @__PURE__ */ React.createElement("span", { className: "shot-ok" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 14, strokeWidth: 2.5 }))) : /* @__PURE__ */ React.createElement(G.Icon, { name: "camera", size: 24 }), /* @__PURE__ */ React.createElement("span", { className: "shot-label" }, s)))), /* @__PURE__ */ React.createElement("h2", { className: "label-title flush" }, car.energy === "El\xE9trico" ? "N\xEDvel da bateria" : "N\xEDvel do tanque"), /* @__PURE__ */ React.createElement("div", { className: "hscroll flush" }, ["1/4", "1/2", "3/4", "Cheio"].map((f) => /* @__PURE__ */ React.createElement(G.Chip, { key: f, selected: fuel === f, onClick: () => setFuel(f) }, f))), /* @__PURE__ */ React.createElement("label", { className: "check" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: ok, onChange: (e) => setOk(e.target.checked) }), /* @__PURE__ */ React.createElement("span", null, "Confirmo que o carro est\xE1 como nas fotos"))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, disabled: !ready, icon: "lock-open", onClick: () => {
      app.updateBooking(b.id, { status: "andamento", startedAt: Date.now(), fuel });
      nav.pop();
      app.toast("Carro liberado. Boa viagem!");
    } }, ready ? "Liberar carro" : "Complete a vistoria")));
  }
  var TAGS = ["Carro limpo", "Retirada f\xE1cil", "Bem conservado", "Anfitri\xE3o atencioso", "Pontual"];
  function Rate({ app, params }) {
    const { nav } = app;
    const b = app.bookingById(params.bookingId);
    const car = app.carById(b.carId);
    const [stars, setStars] = useState5(0);
    const [tags, setTags] = useState5({});
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: "Como foi?", onBack: nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll pad center-col" }, /* @__PURE__ */ React.createElement(CarArt, { car, className: "rate-art" }), /* @__PURE__ */ React.createElement("p", { className: "row-label" }, "Avalie o ", car.model, " de ", firstName(car.owner)), /* @__PURE__ */ React.createElement("div", { className: "star-pick", role: "radiogroup", "aria-label": "Nota" }, [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement("button", { key: i, type: "button", role: "radio", "aria-checked": stars === i, "aria-label": i + (i === 1 ? " estrela" : " estrelas"), className: cx(i <= stars && "on"), onClick: () => setStars(i) }, /* @__PURE__ */ React.createElement(G.Icon, { name: "star", size: 36, filled: i <= stars, strokeWidth: i <= stars ? 0 : 1.5 })))), /* @__PURE__ */ React.createElement("div", { className: "tag-wrap" }, TAGS.map((t) => /* @__PURE__ */ React.createElement(G.Chip, { key: t, selected: !!tags[t], onClick: () => setTags((x) => ({ ...x, [t]: !x[t] })) }, t)))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, disabled: !stars, onClick: () => {
      app.updateBooking(b.id, { status: "concluida", rated: stars });
      nav.home("trips");
      app.toast("Viagem encerrada. Obrigado!");
    } }, b.status === "andamento" ? "Devolver e enviar avalia\xE7\xE3o" : "Enviar avalia\xE7\xE3o")));
  }
  function Chat({ app, params }) {
    const { nav } = app;
    const b = app.bookingById(params.bookingId);
    const car = app.carById(b.carId);
    const [msgs, setMsgs] = useState5([
      { me: false, text: `Oi! Aqui \xE9 ${firstName(car.owner)}. Reserva confirmada.` },
      { me: false, text: car.pickup === "Chave na portaria" ? "\xC9 s\xF3 avisar na portaria que veio buscar o carro do Giro." : car.pickup === "Cofre de chave" ? "O c\xF3digo do cofre aparece na reserva. O carro fica na vaga 12." : "Me avisa uns 10 minutos antes que eu des\xE7o com a chave." }
    ]);
    const [text, setText] = useState5("");
    const end = useRef3(null);
    useEffect5(() => {
      end.current && end.current.scrollIntoView({ block: "end" });
    }, [msgs]);
    function send(e) {
      e.preventDefault();
      const t = text.trim();
      if (!t) return;
      setMsgs((m) => [...m, { me: true, text: t }]);
      setText("");
      setTimeout(() => setMsgs((m) => [...m, { me: false, text: "Combinado. Qualquer coisa estou por aqui." }]), 1400);
    }
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: car.owner, sub: car.model + " \xB7 " + b.id, onBack: nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "scroll pad chat" }, msgs.map((m, i) => /* @__PURE__ */ React.createElement("p", { key: i, className: cx("bubble", m.me && "bubble-me") }, m.text)), /* @__PURE__ */ React.createElement("span", { ref: end })), /* @__PURE__ */ React.createElement("form", { className: "screen-foot chat-form", onSubmit: send }, /* @__PURE__ */ React.createElement("input", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Escreva uma mensagem", "aria-label": "Mensagem" }), /* @__PURE__ */ React.createElement(G.IconButton, { type: "submit", icon: "send", label: "Enviar", variant: "floating" })));
  }

  // src/host.jsx
  var { useState: useState6, useMemo: useMemo3 } = React;
  function weekLabels(n) {
    const out = [], d = today0();
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    for (let i = n - 1; i >= 0; i--) {
      const w = new Date(d);
      w.setDate(d.getDate() - i * 7);
      out.push(i === 0 ? "Atual" : `${w.getDate()}/${w.getMonth() + 1}`);
    }
    return out;
  }
  function Host({ app }) {
    const { state, nav } = app;
    const [editing, setEditing] = useState6(null);
    const net = (v) => v * (1 - CONFIG.ownerCommission);
    const month = EARNINGS_WEEKS.slice(-4).reduce((a, b) => a + b, 0);
    const prev = EARNINGS_WEEKS.slice(0, 4).reduce((a, b) => a + b, 0);
    const growth = Math.round((month / prev - 1) * 100);
    const extra = state.myCars.length - 1;
    return /* @__PURE__ */ React.createElement("div", { className: "screen tab-screen" }, /* @__PURE__ */ React.createElement("header", { className: "tab-head" }, /* @__PURE__ */ React.createElement("h1", { className: "display" }, "Meus carros")), /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "pad" }, /* @__PURE__ */ React.createElement("div", { className: "earn" }, /* @__PURE__ */ React.createElement("span", { className: "earn-label" }, "Voc\xEA recebeu nas \xFAltimas 4 semanas"), /* @__PURE__ */ React.createElement("span", { className: "earn-value" }, brl(net(month))), /* @__PURE__ */ React.createElement("span", { className: "earn-delta" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "trending-up", size: 16 }), " ", growth, "% em rela\xE7\xE3o \xE0s 4 semanas anteriores")), /* @__PURE__ */ React.createElement(EarningsChart, { weeks: EARNINGS_WEEKS.map(net), labels: weekLabels(EARNINGS_WEEKS.length) }), /* @__PURE__ */ React.createElement("div", { className: "stats" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "stat-v" }, "23"), /* @__PURE__ */ React.createElement("span", { className: "stat-l" }, "reservas")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "stat-v" }, "38%"), /* @__PURE__ */ React.createElement("span", { className: "stat-l" }, "ocupa\xE7\xE3o")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "stat-v" }, "4,9"), /* @__PURE__ */ React.createElement("span", { className: "stat-l" }, "nota m\xE9dia"))), /* @__PURE__ */ React.createElement("p", { className: "note" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "wallet", size: 16 }), " Repasse toda segunda-feira via Pix, j\xE1 descontada a comiss\xE3o de ", Math.round(CONFIG.ownerCommission * 100), "%.")), /* @__PURE__ */ React.createElement(Section, { title: "Pr\xF3ximas reservas" }, OWNER_UPCOMING.map((r, i) => {
      const start = addHours(today0(), r.day * 24 + r.start);
      const car = state.myCars[0];
      return /* @__PURE__ */ React.createElement("div", { className: "host-res", key: i }, /* @__PURE__ */ React.createElement(Avatar, { name: r.who, size: 40 }), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, r.who, " ", /* @__PURE__ */ React.createElement("span", { className: "muted" }, "\xB7 \u2605 ", G.formatRating(r.rating))), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, dayLabel(start), " \xB7 ", String(r.start).padStart(2, "0"), ":00 \xB7 ", hoursText(r.hours))), /* @__PURE__ */ React.createElement("span", { className: "row-value" }, brl0(net(G.calcPrice({ rate: car.price, hours: r.hours, dailyCap: car.dailyCap }).rental))));
    })), /* @__PURE__ */ React.createElement(Section, { title: "Seus an\xFAncios", action: extra > 0 ? /* @__PURE__ */ React.createElement("span", { className: "muted small" }, state.myCars.length, " carros") : null }, state.myCars.map((c) => /* @__PURE__ */ React.createElement("div", { className: "listing", key: c.id }, /* @__PURE__ */ React.createElement("div", { className: "listing-main" }, /* @__PURE__ */ React.createElement("span", { className: "car-thumb car-thumb-lg" }, /* @__PURE__ */ React.createElement(CarArt, { car: c, ground: false })), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label strong" }, c.model, " ", c.year), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, brl0(c.price), "/h \xB7 di\xE1ria ", brl0(c.dailyCap)), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, c.active ? c.trips ? `Dispon\xEDvel \xB7 ${c.trips} viagens` : "Dispon\xEDvel \xB7 novo an\xFAncio" : "Pausado: n\xE3o aparece no mapa")), /* @__PURE__ */ React.createElement(Switch, { checked: c.active, label: "An\xFAncio ativo: " + c.model, onChange: (v) => {
      app.updateMyCar(c.id, { active: v });
      app.toast(v ? "An\xFAncio ativo no mapa" : "An\xFAncio pausado");
    } })), editing === c.id ? /* @__PURE__ */ React.createElement("div", { className: "listing-edit" }, /* @__PURE__ */ React.createElement(G.Stepper, { label: "Pre\xE7o por hora", hint: "Carros parecidos: veja a sugest\xE3o ao anunciar", value: c.price, min: 8, max: 80, onChange: (v) => app.updateMyCar(c.id, { price: v }), format: brl0 }), /* @__PURE__ */ React.createElement(G.Stepper, { label: "Di\xE1ria m\xE1xima", hint: "Teto por 24 h", value: c.dailyCap, min: c.price, max: 600, step: 10, onChange: (v) => app.updateMyCar(c.id, { dailyCap: v }), format: brl0 }), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", block: true, onClick: () => {
      setEditing(null);
      app.toast("Pre\xE7o atualizado");
    } }, "Pronto")) : /* @__PURE__ */ React.createElement("div", { className: "listing-actions" }, /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", onClick: () => setEditing(c.id) }, "Editar pre\xE7o"), /* @__PURE__ */ React.createElement(G.Button, { variant: "ghost", icon: "map", onClick: () => app.showOnMap(c.id) }, "Ver no mapa")))), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", block: true, icon: "plus", size: "lg", onClick: () => nav.push("listcar") }, "Anunciar outro carro"))));
  }
  var STEPS = ["Carro", "Fotos", "Pre\xE7o", "Retirada"];
  var SHOTS2 = ["Frente", "Traseira", "Lateral", "Painel"];
  var DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "S\xE1b", "Dom"];
  function ListCar({ app }) {
    const { nav } = app;
    const [step, setStep] = useState6(0);
    const [q, setQ] = useState6("");
    const [model, setModel] = useState6(null);
    const [year, setYear] = useState6(2022);
    const [color, setColor] = useState6(COLORS[1]);
    const [plate, setPlate] = useState6("");
    const [shots, setShots] = useState6({});
    const [price, setPrice] = useState6(null);
    const [cap, setCap] = useState6(null);
    const [pickup, setPickup] = useState6("Cofre de chave");
    const [days, setDays] = useState6({ S\u00E1b: true, Dom: true, Seg: true, Ter: true, Qua: true, Qui: true, Sex: true });
    const m = MODELS.find((x) => x.model === model);
    const suggest = m ? m.suggest : [15, 20];
    const p = price != null ? price : Math.round((suggest[0] + suggest[1]) / 2);
    const c = cap != null ? cap : Math.round(p * 8 / 10) * 10;
    const car = { model: model || "Seu carro", year, body: m ? m.body : "hatch", color: color.hex, colorName: color.name };
    const plateOk = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate);
    const canNext = [!!model && plateOk, Object.keys(shots).length === SHOTS2.length, true, Object.values(days).some(Boolean)][step];
    const models = MODELS.filter((x) => x.model.toLowerCase().includes(q.trim().toLowerCase()));
    const monthly = p * 40 * (1 - CONFIG.ownerCommission);
    function publish() {
      const id = "meu-" + Date.now().toString(36);
      app.addMyCar({
        id,
        model,
        year,
        body: car.body,
        price: p,
        dailyCap: c,
        transmission: "Autom\xE1tico",
        seats: 5,
        energy: "Flex",
        rating: 5,
        trips: 0,
        color: color.hex,
        colorName: color.name,
        owner: "Marina C.",
        ownerSince: "2026",
        ownerResp: "~10 min",
        pickup,
        street: "Rua Ferreira de Ara\xFAjo",
        east: 180 + Math.round(Math.random() * 300),
        north: -380 - Math.round(Math.random() * 300),
        mine: true,
        active: true
      });
      nav.replace("listed", { id });
    }
    return /* @__PURE__ */ React.createElement("div", { className: "screen" }, /* @__PURE__ */ React.createElement(TopBar, { title: "Anunciar carro", sub: `Passo ${step + 1} de ${STEPS.length} \xB7 ${STEPS[step]}`, onBack: step ? () => setStep(step - 1) : nav.pop }), /* @__PURE__ */ React.createElement("div", { className: "progress", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { style: { width: (step + 1) / STEPS.length * 100 + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "scroll pad" }, step === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "title-lg" }, "Qual \xE9 o seu carro?"), /* @__PURE__ */ React.createElement("div", { className: "search-field flush" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "search", size: 20 }), /* @__PURE__ */ React.createElement("input", { type: "search", value: q, onChange: (e) => setQ(e.target.value), placeholder: "Modelo", "aria-label": "Buscar modelo" })), /* @__PURE__ */ React.createElement("div", { className: "model-list", role: "radiogroup", "aria-label": "Modelo" }, models.map((x) => /* @__PURE__ */ React.createElement("button", { key: x.model, type: "button", role: "radio", "aria-checked": model === x.model, className: cx("place", model === x.model && "place-on"), onClick: () => setModel(x.model) }, /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label" }, x.model)), model === x.model ? /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 20, className: "place-check" }) : null))), /* @__PURE__ */ React.createElement("h3", { className: "label-title flush" }, "Ano"), /* @__PURE__ */ React.createElement("div", { className: "hscroll flush" }, [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => /* @__PURE__ */ React.createElement(G.Chip, { key: y, selected: y === year, onClick: () => setYear(y) }, y))), /* @__PURE__ */ React.createElement("h3", { className: "label-title flush" }, "Cor"), /* @__PURE__ */ React.createElement("div", { className: "hscroll flush" }, COLORS.map((x) => /* @__PURE__ */ React.createElement(G.Chip, { key: x.name, selected: x.name === color.name, onClick: () => setColor(x) }, /* @__PURE__ */ React.createElement("span", { className: "swatch", style: { background: x.hex } }), x.name))), /* @__PURE__ */ React.createElement("h3", { className: "label-title flush" }, "Placa"), /* @__PURE__ */ React.createElement("input", { className: "input", value: plate, maxLength: 7, onChange: (e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")), placeholder: "ABC1D23", "aria-label": "Placa", "aria-invalid": plate.length === 7 && !plateOk }), /* @__PURE__ */ React.createElement("p", { className: "note" }, plate.length === 7 && !plateOk ? "Placa inv\xE1lida. Use o formato Mercosul (ABC1D23) ou antigo (ABC1234)." : "Usamos a placa para checar documenta\xE7\xE3o e multas. Ela n\xE3o aparece no an\xFAncio.")) : step === 1 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "title-lg" }, "Fotos do ", model), /* @__PURE__ */ React.createElement("p", { className: "muted" }, "Fotos claras, de dia, alugam at\xE9 2 vezes mais. Toque para adicionar."), /* @__PURE__ */ React.createElement("div", { className: "shots" }, SHOTS2.map((s, i) => /* @__PURE__ */ React.createElement("button", { key: s, type: "button", className: cx("shot", shots[s] && "shot-done"), onClick: () => setShots((x) => ({ ...x, [s]: true })), "aria-label": "Adicionar foto: " + s }, shots[s] ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CarArt, { car, ground: false, className: cx("shot-art", i === 1 && "flip", i >= 2 && "zoom") }), /* @__PURE__ */ React.createElement("span", { className: "shot-ok" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 14, strokeWidth: 2.5 }))) : /* @__PURE__ */ React.createElement(G.Icon, { name: "camera", size: 24 }), /* @__PURE__ */ React.createElement("span", { className: "shot-label" }, s))))) : step === 2 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "title-lg" }, "Quanto cobrar por hora?"), /* @__PURE__ */ React.createElement("div", { className: "suggest" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "info", size: 16 }), " ", model, " ", year, " em Pinheiros: ", /* @__PURE__ */ React.createElement("strong", null, brl0(suggest[0]), " a ", brl0(suggest[1]), "/h")), /* @__PURE__ */ React.createElement("div", { className: "big-stepper" }, /* @__PURE__ */ React.createElement(G.Stepper, { label: "Pre\xE7o por hora", value: p, min: 8, max: 80, onChange: setPrice, format: brl0 }), /* @__PURE__ */ React.createElement(G.Stepper, { label: "Di\xE1ria m\xE1xima", hint: "Teto por 24 h de aluguel", value: c, min: p, max: 600, step: 10, onChange: setCap, format: brl0 })), /* @__PURE__ */ React.createElement("div", { className: "estimate" }, /* @__PURE__ */ React.createElement("span", { className: "earn-label" }, "Alugando 40 horas por m\xEAs, voc\xEA recebe cerca de"), /* @__PURE__ */ React.createElement("span", { className: "earn-value" }, brl0(monthly)), /* @__PURE__ */ React.createElement("span", { className: "muted small" }, "J\xE1 descontada a comiss\xE3o de ", Math.round(CONFIG.ownerCommission * 100), "%. A prote\xE7\xE3o \xE9 paga por quem aluga."))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "title-lg" }, "Como a pessoa pega a chave?"), ["Cofre de chave", "Chave na portaria", "Entrega em m\xE3os"].map((k) => /* @__PURE__ */ React.createElement(
      Radio,
      {
        key: k,
        name: "pickup",
        checked: pickup === k,
        onChange: () => setPickup(k),
        label: k,
        sub: k === "Cofre de chave" ? "Sem encontro. O c\xF3digo vai para quem reservou." : k === "Chave na portaria" ? "Deixe a chave com a portaria do pr\xE9dio." : "Voc\xEA entrega pessoalmente."
      }
    )), /* @__PURE__ */ React.createElement("h3", { className: "label-title flush" }, "Dias dispon\xEDveis"), /* @__PURE__ */ React.createElement("div", { className: "days" }, DAYS.map((d) => /* @__PURE__ */ React.createElement(G.Chip, { key: d, selected: !!days[d], onClick: () => setDays((x) => ({ ...x, [d]: !x[d] })) }, d))), /* @__PURE__ */ React.createElement("div", { className: "card review-card" }, /* @__PURE__ */ React.createElement("span", { className: "car-thumb car-thumb-lg" }, /* @__PURE__ */ React.createElement(CarArt, { car, ground: false })), /* @__PURE__ */ React.createElement("span", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "row-label strong" }, model, " ", year), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, brl0(p), "/h \xB7 di\xE1ria ", brl0(c), " \xB7 ", pickup))))), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot" }, step < STEPS.length - 1 ? /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, disabled: !canNext, onClick: () => setStep(step + 1) }, "Continuar") : /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, disabled: !canNext, onClick: publish }, "Publicar an\xFAncio")));
  }
  function Listed({ app, params }) {
    const car = app.carById(params.id);
    return /* @__PURE__ */ React.createElement("div", { className: "screen confirmed" }, /* @__PURE__ */ React.createElement("div", { className: "scroll pad" }, /* @__PURE__ */ React.createElement("div", { className: "confirmed-hero" }, /* @__PURE__ */ React.createElement("span", { className: "big-check" }, /* @__PURE__ */ React.createElement(G.Icon, { name: "check", size: 40, strokeWidth: 2.25 })), /* @__PURE__ */ React.createElement("h1", { className: "display" }, "Seu carro est\xE1 no mapa"), /* @__PURE__ */ React.createElement("p", { className: "muted" }, "Quem estiver perto j\xE1 pode reservar o ", car.model, " por ", brl0(car.price), "/h. Avisamos voc\xEA a cada pedido.")), /* @__PURE__ */ React.createElement(CarArt, { car, className: "confirmed-art" })), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot stack" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, icon: "map", onClick: () => app.showOnMap(car.id) }, "Ver no mapa"), /* @__PURE__ */ React.createElement(G.Button, { variant: "ghost", block: true, onClick: () => app.nav.home("host") }, "Ir para Meus carros")));
  }

  // src/main.jsx
  var { useState: useState7, useEffect: useEffect6, useMemo: useMemo4, useCallback, useRef: useRef4 } = React;
  var KEY = "giro-demo-v1";
  var HOST_THEME = document.documentElement.getAttribute("data-theme");
  function initialState() {
    const h = nextHour();
    return {
      onboarded: false,
      theme: "auto",
      search: { placeId: "pinheiros", dayOffset: h > 22 ? 1 : 0, startHour: h > 22 ? 9 : h, hours: 4 },
      bookings: [],
      myCars: [MY_CAR],
      favorites: []
    };
  }
  var ROUTES = { search: Search, car: CarDetail, checkout: Checkout, pay: Pay, confirmed: Confirmed, booking: Booking, inspection: Inspection, rate: Rate, chat: Chat, listcar: ListCar, listed: Listed };
  var TABS = [
    { id: "explore", label: "Explorar", icon: "compass", Screen: Explore },
    { id: "trips", label: "Viagens", icon: "calendar", Screen: Trips },
    { id: "host", label: "Meus carros", icon: "car", Screen: Host },
    { id: "profile", label: "Perfil", icon: "user", Screen: Profile }
  ];
  function useMedia(q) {
    const mq = useMemo4(() => window.matchMedia(q), [q]);
    const [m, setM] = useState7(mq.matches);
    useEffect6(() => {
      const on = () => setM(mq.matches);
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    }, [mq]);
    return m;
  }
  function useWindow() {
    const [s, setS] = useState7({ w: window.innerWidth, h: window.innerHeight });
    useEffect6(() => {
      const on = () => setS({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", on);
      return () => window.removeEventListener("resize", on);
    }, []);
    return s;
  }
  function App() {
    const [state, setState] = useState7(() => Object.assign(initialState(), load(KEY, {})));
    const [tab, setTab] = useState7("explore");
    const [stack, setStack] = useState7([]);
    const [toastMsg, setToast] = useState7(null);
    const [me, setMe] = useState7(null);
    const [focusReq, setFocusReq] = useState7(null);
    const sysDark = useMedia("(prefers-color-scheme: dark)");
    const win = useWindow();
    const framed = win.w >= 720;
    const H = framed ? 844 : win.h;
    const scale = framed ? Math.min(1, (win.h - 48) / 844) : 1;
    const theme = state.theme === "auto" ? HOST_THEME === "dark" || HOST_THEME === "light" ? HOST_THEME : sysDark ? "dark" : "light" : state.theme;
    useEffect6(() => {
      save(KEY, state);
    }, [state]);
    useEffect6(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
    useEffect6(() => {
      if (!toastMsg) return;
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }, [toastMsg]);
    const place = PLACES.find((p) => p.id === state.search.placeId) || PLACES[0];
    const allCars = useMemo4(() => [...CARS, ...state.myCars].map((c) => ({ ...c, photo: carPhoto(c) })), [state.myCars]);
    const cars = useMemo4(() => {
      const from = me && distance(me, place) < 5e3 ? me : place;
      return allCars.filter((c) => !c.mine || c.active).map((c) => {
        const pos = offset(place, c.east, c.north);
        return { ...c, pos, distance: distance(from, pos) };
      });
    }, [allCars, place, me]);
    const update = (fn) => setState((s) => ({ ...s, ...fn(s) }));
    const nav = {
      push: (name, params = {}) => setStack((s) => [...s, { name, params, key: name + Date.now() }]),
      pop: () => setStack((s) => s.slice(0, -1)),
      replace: (name, params = {}) => setStack((s) => [...s.slice(0, -1), { name, params, key: name + Date.now() }]),
      home: (t) => {
        setStack([]);
        if (t) setTab(t);
      },
      tab: (t) => {
        setStack([]);
        setTab(t);
      }
    };
    const app = {
      state,
      nav,
      cars,
      place,
      me,
      theme,
      H,
      focusReq,
      setMe,
      toast: (text) => setToast({ text, id: Date.now() }),
      setSearch: (search) => update(() => ({ search })),
      setTheme: (theme2) => update(() => ({ theme: theme2 })),
      carById: (id) => cars.find((c) => c.id === id) || allCars.map((c) => ({ ...c, pos: offset(place, c.east, c.north), distance: 0 })).find((c) => c.id === id),
      bookings: () => {
        const past = PAST_TRIPS.map((p) => {
          const d = /* @__PURE__ */ new Date();
          d.setDate(d.getDate() - p.daysAgo);
          d.setHours(p.startHour, 0, 0, 0);
          return { id: p.id, carId: p.carId, start: d.toISOString(), hours: p.hours, protection: "basica", payment: "pix", total: p.total, status: "concluida", rated: p.rated };
        });
        return [...state.bookings].sort((a, b) => b.createdAt - a.createdAt).concat(past);
      },
      bookingById: (id) => app.bookings().find((b) => b.id === id),
      addBooking: (b) => update((s) => ({ bookings: [...s.bookings, b] })),
      updateBooking: (id, patch) => update((s) => ({ bookings: s.bookings.map((b) => b.id === id ? { ...b, ...patch } : b) })),
      addMyCar: (c) => update((s) => ({ myCars: [...s.myCars, c] })),
      updateMyCar: (id, patch) => update((s) => ({ myCars: s.myCars.map((c) => c.id === id ? { ...c, ...patch } : c) })),
      toggleFav: (id) => update((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
      showOnMap: (id) => {
        const c = allCars.find((x) => x.id === id);
        if (c && c.mine && !c.active) update((s) => ({ myCars: s.myCars.map((x) => x.id === id ? { ...x, active: true } : x) }));
        update((s) => ({ search: { ...s.search, placeId: "pinheiros" } }));
        setStack([]);
        setTab("explore");
        setFocusReq({ id, at: Date.now() });
      },
      finishOnboarding: (to) => {
        update(() => ({ onboarded: true }));
        setTab(to);
      },
      reset: () => {
        try {
          localStorage.removeItem(KEY);
        } catch (e) {
        }
        setState(initialState());
        setStack([]);
        setTab("explore");
        setMe(null);
      }
    };
    const top = stack[stack.length - 1];
    const TabScreen = TABS.find((t) => t.id === tab).Screen;
    let body;
    if (!state.onboarded) {
      body = /* @__PURE__ */ React.createElement(Welcome, { app });
    } else {
      body = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: cx("tab-layer", stack.length && "covered"), "aria-hidden": stack.length ? true : void 0 }, /* @__PURE__ */ React.createElement(TabScreen, { app, key: tab }), /* @__PURE__ */ React.createElement("nav", { className: "tabbar", "aria-label": "Navega\xE7\xE3o principal" }, TABS.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, type: "button", className: cx("tab", tab === t.id && "tab-on"), "aria-current": tab === t.id ? "page" : void 0, onClick: () => nav.tab(t.id) }, /* @__PURE__ */ React.createElement(G.Icon, { name: t.icon, size: 22, strokeWidth: tab === t.id ? 2 : 1.75 }), /* @__PURE__ */ React.createElement("span", null, t.label), t.id === "trips" && state.bookings.some((b) => b.status === "confirmada" || b.status === "andamento") ? /* @__PURE__ */ React.createElement("span", { className: "tab-dot", "aria-label": "viagem ativa" }) : null)))), stack.map((r, i) => {
        const Screen = ROUTES[r.name];
        return /* @__PURE__ */ React.createElement("div", { key: r.key, className: cx("stack-layer", i < stack.length - 1 && "covered"), "aria-hidden": i < stack.length - 1 ? true : void 0 }, /* @__PURE__ */ React.createElement(Screen, { app, params: r.params }));
      }));
    }
    const device = /* @__PURE__ */ React.createElement("div", { className: "device", style: framed ? { transform: `scale(${scale})` } : void 0 }, /* @__PURE__ */ React.createElement(ArtDefs, null), body, /* @__PURE__ */ React.createElement(Toast, { message: toastMsg }));
    if (!framed) return device;
    return /* @__PURE__ */ React.createElement("div", { className: "stage" }, /* @__PURE__ */ React.createElement("aside", { className: "pitch" }, /* @__PURE__ */ React.createElement("p", { className: "pitch-name" }, "Giro"), /* @__PURE__ */ React.createElement("p", { className: "pitch-line" }, "Carros parados viram renda. Alugue o carro de um vizinho, por hora."), /* @__PURE__ */ React.createElement("ul", { className: "pitch-list" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(G.Icon, { name: "map", size: 18 }), "Explore o mapa e escolha um carro"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(G.Icon, { name: "wallet", size: 18 }), "Reserve e pague com Pix"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(G.Icon, { name: "camera", size: 18 }), "Fa\xE7a a vistoria e comece a viagem"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(G.Icon, { name: "car", size: 18 }), "Em Meus carros, anuncie o seu")), /* @__PURE__ */ React.createElement("p", { className: "pitch-foot" }, "Prot\xF3tipo naveg\xE1vel \xB7 dados de demonstra\xE7\xE3o")), /* @__PURE__ */ React.createElement("div", { className: "device-slot", style: { width: 390 * scale, height: 844 * scale } }, device));
  }
  function Welcome({ app }) {
    const sample = [CARS[5], CARS[0], CARS[6]];
    return /* @__PURE__ */ React.createElement("div", { className: "screen welcome" }, /* @__PURE__ */ React.createElement("div", { className: "welcome-art", "aria-hidden": "true" }, sample.map((c, i) => /* @__PURE__ */ React.createElement(CarArt, { key: c.id, car: c, className: "welcome-car welcome-car-" + i }))), /* @__PURE__ */ React.createElement("div", { className: "welcome-text" }, /* @__PURE__ */ React.createElement("h1", { className: "welcome-name" }, "Giro"), /* @__PURE__ */ React.createElement("p", { className: "welcome-line" }, "Alugue o carro de quem mora perto, por hora. Ou ganhe com o seu, que passa o dia parado.")), /* @__PURE__ */ React.createElement("footer", { className: "screen-foot stack welcome-foot" }, /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, onClick: () => app.finishOnboarding("explore") }, "Quero alugar um carro"), /* @__PURE__ */ React.createElement(G.Button, { size: "lg", block: true, variant: "secondary", onClick: () => app.finishOnboarding("host") }, "Quero ganhar com meu carro"), /* @__PURE__ */ React.createElement("p", { className: "foot-note" }, "Ao continuar, voc\xEA aceita os Termos de uso e a Pol\xEDtica de privacidade.")));
  }
  function Profile({ app }) {
    const { state } = app;
    return /* @__PURE__ */ React.createElement("div", { className: "screen tab-screen" }, /* @__PURE__ */ React.createElement("header", { className: "tab-head" }, /* @__PURE__ */ React.createElement("h1", { className: "display" }, "Perfil")), /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "pad profile-head" }, /* @__PURE__ */ React.createElement(Avatar, { name: USER.name, size: 64 }), /* @__PURE__ */ React.createElement("div", { className: "row-text" }, /* @__PURE__ */ React.createElement("span", { className: "title-md" }, USER.name), /* @__PURE__ */ React.createElement("span", { className: "row-sub" }, "No Giro desde ", USER.memberSince, " \xB7 \u2605 ", G.formatRating(USER.rating)))), /* @__PURE__ */ React.createElement("div", { className: "pad" }, /* @__PURE__ */ React.createElement(G.Badge, { tone: "accent", icon: "badge-check" }, "CNH e identidade verificadas")), /* @__PURE__ */ React.createElement(Section, { title: "Conta" }, /* @__PURE__ */ React.createElement(Row, { icon: "calendar", label: "Viagens feitas", value: String(USER.trips + state.bookings.filter((b) => b.status === "concluida").length) }), /* @__PURE__ */ React.createElement(Row, { icon: "star", label: "Favoritos", value: String(state.favorites.length) }), /* @__PURE__ */ React.createElement(Row, { icon: "credit-card", label: "Pagamento", sub: `Pix \xB7 ${USER.card}`, onClick: () => app.toast("Formas de pagamento") }), /* @__PURE__ */ React.createElement(Row, { icon: "bell", label: "Notifica\xE7\xF5es", sub: "Pedidos, mensagens e lembretes", onClick: () => app.toast("Notifica\xE7\xF5es ativadas") }), /* @__PURE__ */ React.createElement(Row, { icon: "circle-help", label: "Ajuda", sub: "Atendimento 24 h no chat", onClick: () => app.toast("Atendimento 24 h no chat") })), /* @__PURE__ */ React.createElement(Section, { title: "Apar\xEAncia" }, /* @__PURE__ */ React.createElement("div", { className: "segmented flush", role: "radiogroup", "aria-label": "Tema" }, [["auto", "Autom\xE1tico"], ["light", "Claro"], ["dark", "Escuro"]].map(([k, l]) => /* @__PURE__ */ React.createElement("button", { key: k, role: "radio", "aria-checked": state.theme === k, onClick: () => app.setTheme(k) }, l)))), /* @__PURE__ */ React.createElement(Section, { title: "Demonstra\xE7\xE3o" }, /* @__PURE__ */ React.createElement("p", { className: "note" }, "Este \xE9 um prot\xF3tipo naveg\xE1vel com dados fict\xEDcios. Nenhum pagamento \xE9 cobrado."), /* @__PURE__ */ React.createElement(G.Button, { variant: "secondary", icon: "rotate-ccw", onClick: () => {
      app.reset();
    } }, "Reiniciar demonstra\xE7\xE3o"))));
  }
  ReactDOM.createRoot(document.getElementById("app")).render(/* @__PURE__ */ React.createElement(App, null));
})();
