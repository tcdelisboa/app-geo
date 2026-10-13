/* Giro — protótipo da tela Explorar com mapa real (Leaflet + OpenStreetMap/CARTO).
   Componentes visuais vêm do design system em design-system/giro.js (window.Giro). */
(function () {
  'use strict';
  var G = window.Giro, L = window.L, h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef;
  var CFG = window.GIRO_CONFIG, CARS = window.GIRO_CARS;

  var FILTERS = [
    { id: 'price', label: 'Até R$ 20/h', test: function (c) { return c.price <= 20; } },
    { id: 'auto', label: 'Automático', test: function (c) { return c.transmission === 'Automático'; } },
    { id: 'ev', label: 'Elétrico', icon: 'zap', test: function (c) { return c.energy === 'Elétrico'; } },
    { id: 'top', label: 'Nota 4,8+', icon: 'star', test: function (c) { return c.rating >= 4.8; } }
  ];
  var SHEET = { peek: 300, open: 0.82, detail: 566 };
  var TILES = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };
  var ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  /* ---------- Geo helpers ---------- */
  function offset(origin, east, north) {
    var dLat = north / 111320;
    var dLng = east / (111320 * Math.cos(origin.lat * Math.PI / 180));
    return { lat: origin.lat + dLat, lng: origin.lng + dLng };
  }
  function distance(a, b) {
    var R = 6371000, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  function hh(n) { return (n < 10 ? '0' : '') + n + ':00'; }
  function whenText(hours) {
    var end = CFG.startHour + hours;
    return end < 24 ? 'Hoje · ' + hh(CFG.startHour) + ' – ' + hh(end) : 'Hoje ' + hh(CFG.startHour) + ' – amanhã ' + hh(end - 24);
  }
  function initials(name) { return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase(); }
  function firstName(name) { return name.split(' ')[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Hooks ---------- */
  function useMedia(query) {
    var mq = useMemo(function () { return window.matchMedia(query); }, [query]);
    var s = useState(mq.matches);
    useEffect(function () {
      function on() { s[1](mq.matches); }
      mq.addEventListener('change', on);
      return function () { mq.removeEventListener('change', on); };
    }, [mq]);
    return s[0];
  }
  function useViewportHeight() {
    var s = useState(window.innerHeight);
    useEffect(function () {
      function on() { s[1](window.innerHeight); }
      window.addEventListener('resize', on);
      return function () { window.removeEventListener('resize', on); };
    }, []);
    return s[0];
  }

  /* ---------- Map ---------- */
  function pinHtml(car, selected) {
    var price = G.formatBRL(car.price, { cents: false });
    var label = car.model + ' ' + car.year + ', ' + price + ' por hora' + (car.unavailable ? ', indisponível no horário' : '');
    return '<div class="gr-map-marker" style="left:0;top:0">' +
      '<button type="button" class="gr-pin' + (selected ? ' gr-pin-selected' : '') + (car.unavailable ? ' gr-pin-unavailable' : '') + '"' +
      ' aria-pressed="' + (selected ? 'true' : 'false') + '" aria-label="' + esc(label) + '">' +
      '<span class="gr-pin-body">' + esc(price) + '</span></button></div>';
  }

  function MapView(props) {
    var el = useRef(null), mapRef = useRef(null), tilesRef = useRef(null), markers = useRef({}), meRef = useRef(null);
    var onSelect = useRef(props.onSelect); onSelect.current = props.onSelect;
    var onBlank = useRef(props.onBlank); onBlank.current = props.onBlank;

    useEffect(function () {
      var map = L.map(el.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.5 });
      map.attributionControl.setPrefix(false);
      map.setView([props.center.lat, props.center.lng], 15);
      map.on('click', function () { onBlank.current(); });
      mapRef.current = map;
      return function () { map.remove(); };
    }, []);

    useEffect(function () {
      var map = mapRef.current;
      if (tilesRef.current) map.removeLayer(tilesRef.current);
      tilesRef.current = L.tileLayer(TILES[props.theme], { maxZoom: 19, subdomains: 'abcd', attribution: ATTRIBUTION }).addTo(map);
    }, [props.theme]);

    /* Keep one marker per visible car, restyled when the selection changes. */
    useEffect(function () {
      var map = mapRef.current, seen = {};
      props.cars.forEach(function (car) {
        seen[car.id] = true;
        var selected = car.id === props.selectedId;
        var icon = L.divIcon({ className: 'giro-marker', html: pinHtml(car, selected), iconSize: [0, 0] });
        var m = markers.current[car.id];
        if (!m) {
          m = L.marker([car.pos.lat, car.pos.lng], { icon: icon, keyboard: false, riseOnHover: true });
          m.on('click', function (e) { L.DomEvent.stopPropagation(e); onSelect.current(car.id); });
          m.addTo(map);
          markers.current[car.id] = m;
        } else {
          m.setLatLng([car.pos.lat, car.pos.lng]);
          m.setIcon(icon);
        }
        m.setZIndexOffset(selected ? 1000 : car.unavailable ? -100 : 0);
      });
      Object.keys(markers.current).forEach(function (id) {
        if (!seen[id]) { map.removeLayer(markers.current[id]); delete markers.current[id]; }
      });
    }, [props.cars, props.selectedId]);

    useEffect(function () {
      var map = mapRef.current;
      if (meRef.current) { map.removeLayer(meRef.current); meRef.current = null; }
      if (!props.me) return;
      meRef.current = L.marker([props.me.lat, props.me.lng], {
        icon: L.divIcon({ className: 'giro-marker', html: '<span class="gr-me" style="left:0;top:0" role="img" aria-label="Você está aqui"></span>', iconSize: [0, 0] }),
        keyboard: false, interactive: false, zIndexOffset: 500
      }).addTo(map);
    }, [props.me]);

    /* Bring the target into the free area (between the top bar and the sheet, or right of the side panel). */
    useEffect(function () {
      var map = mapRef.current, t = props.focus;
      if (!t) return;
      map.invalidateSize();
      var size = map.getSize(), pad = props.padding;
      var want = L.point(pad.left + (size.x - pad.left - pad.right) / 2, pad.top + (size.y - pad.top - pad.bottom) / 2);
      if (t.zoom) map.setZoom(t.zoom, { animate: false });
      var p = map.latLngToContainerPoint([t.lat, t.lng]);
      map.panBy(p.subtract(want), { animate: true, duration: 0.45 });
    }, [props.focus]);

    return h('div', { ref: el, className: 'map', role: 'region', 'aria-label': 'Mapa de carros disponíveis' });
  }

  /* ---------- App ---------- */
  function App() {
    var desktop = useMedia('(min-width: 900px)');
    var dark = useMedia('(prefers-color-scheme: dark)');
    var vh = useViewportHeight();
    var s1 = useState({}), active = s1[0], setActive = s1[1];
    var s2 = useState(null), selId = s2[0], setSelId = s2[1];
    var s3 = useState(false), open = s3[0], setOpen = s3[1];
    var s4 = useState(CFG.defaultHours), hours = s4[0], setHours = s4[1];
    var s5 = useState(null), booked = s5[0], setBooked = s5[1];
    var s6 = useState({ origin: CFG.origin, me: null, place: CFG.place }), loc = s6[0], setLoc = s6[1];
    var s7 = useState(null), focus = s7[0], setFocus = s7[1];
    var s8 = useState(null), notice = s8[0], setNotice = s8[1];

    var theme = dark ? 'dark' : 'light';
    useEffect(function () { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

    var cars = useMemo(function () {
      var from = loc.me || loc.origin;
      return CARS.map(function (c) {
        var pos = offset(loc.origin, c.east, c.north);
        return Object.assign({}, c, { pos: pos, distance: distance(from, pos) });
      });
    }, [loc]);

    var visible = useMemo(function () {
      return cars.filter(function (c) {
        return FILTERS.every(function (f) { return !active[f.id] || f.test(c); });
      }).sort(function (a, b) { return (a.unavailable ? 1 : 0) - (b.unavailable ? 1 : 0) || a.distance - b.distance; });
    }, [cars, active]);
    var available = visible.filter(function (c) { return !c.unavailable; }).length;
    var sel = null;
    for (var i = 0; i < visible.length; i++) if (visible[i].id === selId) sel = visible[i];

    var sheetH = desktop ? null : sel ? Math.min(SHEET.detail, vh - 120) : open ? Math.round(vh * SHEET.open) : Math.min(SHEET.peek, vh * 0.45);
    var padding = desktop ? { top: 120, bottom: 24, left: 432, right: 24 } : { top: sel ? 84 : 132, bottom: sheetH || 0, left: 0, right: 0 };

    useEffect(function () {
      function onKey(e) { if (e.key === 'Escape') { setSelId(null); setBooked(null); } }
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, []);

    function select(id) {
      var next = id === selId ? null : id;
      setSelId(next); setBooked(null); setOpen(false);
      if (next) {
        var car = cars.filter(function (c) { return c.id === next; })[0];
        setFocus({ lat: car.pos.lat, lng: car.pos.lng, at: Date.now() });
      }
    }
    function toggle(id) {
      setActive(function (a) { var n = Object.assign({}, a); n[id] = !a[id]; return n; });
    }
    function locate() {
      var target = loc.me || loc.origin;
      if (!navigator.geolocation) { setFocus({ lat: target.lat, lng: target.lng, at: Date.now() }); return; }
      navigator.geolocation.getCurrentPosition(function (p) {
        var me = { lat: p.coords.latitude, lng: p.coords.longitude };
        var far = distance(me, CFG.origin) > 5000;
        setLoc({ origin: far ? me : CFG.origin, me: me, place: far ? 'Perto de você' : CFG.place });
        setSelId(null);
        setFocus({ lat: me.lat, lng: me.lng, zoom: 15, at: Date.now() });
        if (far) setNotice('Carros de exemplo posicionados perto de você.');
      }, function () {
        setFocus({ lat: target.lat, lng: target.lng, at: Date.now() });
        setNotice('Não foi possível ver sua localização. Mostrando ' + CFG.place + '.');
      }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
    }
    useEffect(function () {
      if (!notice) return;
      var t = setTimeout(function () { setNotice(null); }, 4000);
      return function () { clearTimeout(t); };
    }, [notice]);

    var count = Object.keys(active).filter(function (k) { return active[k]; }).length;

    var sheet;
    if (sel) {
      var price = G.calcPrice({ rate: sel.price, hours: hours, dailyCap: sel.dailyCap, protectionPerHour: CFG.protectionPerHour, feeRate: CFG.feeRate });
      var items = price.items.map(function (it) { return it.label === 'Proteção básica' ? { label: it.label, value: it.value } : it; });
      var footer = sel.unavailable
        ? h('div', null,
            h(G.Button, { variant: 'secondary', size: 'lg', block: true, disabled: true }, 'Indisponível nesse horário'),
            h('p', { className: 'foot-note' }, 'Mude o horário ou escolha outro carro no mapa.'))
        : booked === sel.id
          ? h('div', { className: 'done', role: 'status' }, h(G.Icon, { name: 'check', size: 20 }), 'Pedido enviado a ' + firstName(sel.owner))
          : h('div', null,
              h(G.Button, { size: 'lg', block: true, onClick: function () { setBooked(sel.id); } }, 'Reservar · ' + G.formatBRL(price.total)),
              h('p', { className: 'foot-note' }, 'Você só é cobrado se ' + firstName(sel.owner) + ' aceitar.'));
      sheet = h(G.BottomSheet, { className: 'panel', ariaLabel: sel.model, style: sheetH ? { height: sheetH + 'px' } : undefined, footer: footer },
        h(G.IconButton, { className: 'close', icon: 'x', size: 'sm', label: 'Fechar detalhes', onClick: function () { setSelId(null); } }),
        h('div', { className: 'detail' },
          h(G.CarCard, { car: sel, variant: 'detail' }),
          h('div', { className: 'owner' },
            h('span', { className: 'avatar', 'aria-hidden': true }, initials(sel.owner)),
            h('span', { className: 'owner-text' },
              h('span', { className: 'owner-name' }, sel.owner),
              h('span', { className: 'owner-sub' }, 'CNH verificada · ' + sel.pickup)),
            h(G.Icon, { name: 'badge-check', size: 20, title: 'Verificado', style: { color: 'var(--accent-ink)', marginLeft: 'auto' } })),
          h('div', { className: 'block' },
            h(G.Stepper, { label: 'Duração', hint: whenText(hours), value: hours, min: 1, max: CFG.maxHours, onChange: function (v) { setHours(v); setBooked(null); } })),
          h('div', { className: 'block' }, h(G.PriceSummary, { items: items, total: price.total }))
        )
      );
    } else {
      sheet = h(G.BottomSheet, {
        className: 'panel',
        title: available === 0 ? 'Nenhum carro disponível' : available === 1 ? '1 carro disponível' : available + ' carros disponíveis',
        subtitle: 'Preço por hora · mais próximos primeiro',
        onGrab: desktop ? undefined : function () { setOpen(!open); }, expanded: open, grabLabel: open ? 'Recolher lista' : 'Expandir lista',
        action: desktop ? null : h(G.IconButton, { icon: open ? 'map' : 'list', label: open ? 'Ver mapa' : 'Ver lista', onClick: function () { setOpen(!open); } }),
        style: sheetH ? { height: sheetH + 'px' } : undefined
      },
        visible.length
          ? visible.map(function (c) { return h(G.CarCard, { key: c.id, car: c, onClick: function () { select(c.id); } }); })
          : h('div', { className: 'empty' },
              h('p', null, 'Nenhum carro com esses filtros por aqui.'),
              h(G.Button, { variant: 'secondary', onClick: function () { setActive({}); } }, 'Limpar filtros'))
      );
    }

    return h('div', { className: 'app' + (desktop ? ' is-desktop' : ''), style: { '--sheet-h': (sheetH || 0) + 'px' } },
      h(MapView, {
        center: loc.origin, theme: theme, cars: visible, selectedId: sel && sel.id, me: loc.me,
        onSelect: select, onBlank: function () { setSelId(null); }, focus: focus, padding: padding
      }),
      h('div', { className: 'top' },
        h(G.SearchBar, { place: loc.place, when: whenText(hours) }),
        h('div', { className: 'chips', hidden: !!sel && !desktop, role: 'group', 'aria-label': 'Filtros' + (count ? ' (' + count + ' ativos)' : '') },
          FILTERS.map(function (f) { return h(G.Chip, { key: f.id, icon: f.icon, floating: true, selected: !!active[f.id], onClick: function () { toggle(f.id); } }, f.label); }))
      ),
      h(G.IconButton, {
        className: 'locate' + (!desktop && (sel || open) ? ' is-hidden' : ''), icon: 'locate-fixed', label: 'Centralizar no meu local', variant: 'floating', onClick: locate
      }),
      notice ? h('div', { className: 'toast', role: 'status' }, notice) : null,
      sheet
    );
  }

  ReactDOM.createRoot(document.getElementById('app')).render(h(App));
})();
