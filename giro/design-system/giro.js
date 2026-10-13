/* @ds-bundle: {"format":4,"namespace":"Giro","components":[{"name":"Button"},{"name":"IconButton"},{"name":"Chip"},{"name":"Badge"},{"name":"Icon"},{"name":"SearchBar"},{"name":"PricePin"},{"name":"MapCanvas"},{"name":"BottomSheet"},{"name":"CarCard"},{"name":"Stepper"},{"name":"PriceSummary"}]} */
(function () {
  'use strict';
  var React = window.React;
  var h = React.createElement;

  /* Icons: Lucide (ISC license, lucide.dev), 24px grid. */
  var ICONS = {"search":[["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],"sliders-horizontal":[["path",{"d":"M10 5H3"}],["path",{"d":"M12 19H3"}],["path",{"d":"M14 3v4"}],["path",{"d":"M16 17v4"}],["path",{"d":"M21 12h-9"}],["path",{"d":"M21 19h-5"}],["path",{"d":"M21 5h-7"}],["path",{"d":"M8 10v4"}],["path",{"d":"M8 12H3"}]],"locate-fixed":[["line",{"x1":"2","x2":"5","y1":"12","y2":"12"}],["line",{"x1":"19","x2":"22","y1":"12","y2":"12"}],["line",{"x1":"12","x2":"12","y1":"2","y2":"5"}],["line",{"x1":"12","x2":"12","y1":"19","y2":"22"}],["circle",{"cx":"12","cy":"12","r":"7"}],["circle",{"cx":"12","cy":"12","r":"3"}]],"star":[["path",{"d":"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"}]],"users":[["path",{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{"d":"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{"d":"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{"cx":"9","cy":"7","r":"4"}]],"zap":[["path",{"d":"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]],"fuel":[["path",{"d":"M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5"}],["path",{"d":"M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16"}],["path",{"d":"M2 21h13"}],["path",{"d":"M3 9h11"}]],"clock":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 6v6l4 2"}]],"calendar":[["path",{"d":"M8 2v3"}],["path",{"d":"M16 2v3"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2"}],["path",{"d":"M3 9h18"}]],"chevron-right":[["path",{"d":"m9 18 6-6-6-6"}]],"chevron-left":[["path",{"d":"m15 18-6-6 6-6"}]],"x":[["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],"check":[["path",{"d":"M20 6 9 17l-5-5"}]],"shield-check":[["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{"d":"m9 12 2 2 4-4"}]],"key-round":[["path",{"d":"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"}],["circle",{"cx":"16.5","cy":"7.5","r":".5","fill":"currentColor"}]],"car-front":[["path",{"d":"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"}],["path",{"d":"M7 14h.01"}],["path",{"d":"M17 14h.01"}],["rect",{"width":"18","height":"8","x":"3","y":"10","rx":"2"}],["path",{"d":"M5 18v2"}],["path",{"d":"M19 18v2"}]],"map-pin":[["path",{"d":"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"}],["circle",{"cx":"12","cy":"10","r":"3"}]],"minus":[["path",{"d":"M5 12h14"}]],"plus":[["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],"navigation":[["polygon",{"points":"3 11 22 2 13 21 11 13 3 11"}]],"list":[["path",{"d":"M3 5h.01"}],["path",{"d":"M3 12h.01"}],["path",{"d":"M3 19h.01"}],["path",{"d":"M8 5h13"}],["path",{"d":"M8 12h13"}],["path",{"d":"M8 19h13"}]],"map":[["path",{"d":"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"}],["path",{"d":"M15 5.764v15"}],["path",{"d":"M9 3.236v15"}]],"info":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],"badge-check":[["path",{"d":"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"}],["path",{"d":"m16 9-5.5 5.5L8 12"}]]};

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) === -1) out[k] = obj[k];
    return out;
  }

  /* ---------- Formatting and pricing helpers ---------- */
  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var BRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  function formatBRL(value, opts) {
    return (opts && opts.cents === false ? BRL0 : BRL).format(value);
  }
  function formatDistance(meters) {
    if (meters < 1000) return Math.max(10, Math.round(meters / 10) * 10) + ' m';
    return (Math.round(meters / 100) / 10).toFixed(1).replace('.', ',') + ' km';
  }
  function walkMinutes(meters) {
    return Math.max(1, Math.round(meters / 80));
  }
  function formatRating(r) {
    return r.toFixed(1).replace('.', ',');
  }
  function cents(v) { return Math.round(v * 100) / 100; }
  /* Hourly price with an optional daily cap, per-hour protection and a service fee on top. */
  function calcPrice(o) {
    var hours = o.hours, rate = o.rate, cap = o.dailyCap || 0;
    var protection = cents((o.protectionPerHour || 0) * hours);
    var rental;
    if (cap) {
      var days = Math.floor(hours / 24), rest = hours % 24;
      rental = days * cap + Math.min(rest * rate, cap);
    } else {
      rental = hours * rate;
    }
    rental = cents(rental);
    var capped = rental < cents(hours * rate);
    var fee = cents((rental + protection) * (o.feeRate || 0));
    var total = cents(rental + protection + fee);
    var items = [
      { label: formatBRL(rate, { cents: false }) + ' × ' + hours + ' h', value: rental, hint: capped ? 'Diária máxima aplicada' : undefined }
    ];
    if (protection) items.push({ label: 'Proteção básica', value: protection, hint: 'Danos, roubo e terceiros' });
    if (fee) items.push({ label: 'Taxa de serviço', value: fee });
    return { rental: rental, protection: protection, fee: fee, total: total, capped: capped, items: items };
  }

  /* ---------- Icon ---------- */
  function Icon(props) {
    var node = ICONS[props.name];
    if (!node) return null;
    var size = props.size || 20;
    var labelled = !!props.title;
    return h('svg', {
      className: cx('gr-icon', props.className),
      width: size, height: size, viewBox: '0 0 24 24',
      fill: props.filled ? 'currentColor' : 'none',
      stroke: 'currentColor', strokeWidth: props.strokeWidth || 1.75,
      strokeLinecap: 'round', strokeLinejoin: 'round',
      focusable: 'false',
      role: labelled ? 'img' : undefined,
      'aria-label': labelled ? props.title : undefined,
      'aria-hidden': labelled ? undefined : true,
      style: props.style
    }, node.map(function (n, i) { return h(n[0], Object.assign({ key: i }, n[1])); }));
  }
  Icon.names = Object.keys(ICONS);

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'primary';
    var rest = omit(props, ['variant', 'size', 'block', 'icon', 'iconRight', 'className', 'children', 'type']);
    return h('button', Object.assign({}, rest, {
      type: props.type || 'button',
      className: cx('gr-btn', 'gr-btn-' + variant, props.size === 'lg' && 'gr-btn-lg', props.block && 'gr-btn-block', props.className)
    }),
      props.icon ? h(Icon, { name: props.icon, size: 20 }) : null,
      h('span', null, props.children),
      props.iconRight ? h(Icon, { name: props.iconRight, size: 20 }) : null
    );
  }

  /* ---------- IconButton ---------- */
  function IconButton(props) {
    var variant = props.variant || 'plain';
    var rest = omit(props, ['icon', 'label', 'variant', 'size', 'badge', 'className', 'type']);
    return h('button', Object.assign({}, rest, {
      type: props.type || 'button',
      'aria-label': props.badge ? props.label + ' (' + props.badge + ' ativos)' : props.label,
      title: props.label,
      className: cx('gr-iconbtn', variant !== 'plain' && 'gr-iconbtn-' + variant, props.size === 'sm' && 'gr-iconbtn-sm', props.className)
    }),
      h(Icon, { name: props.icon, size: props.size === 'sm' ? 18 : 22 }),
      props.badge ? h('span', { className: 'gr-iconbtn-dot', 'aria-hidden': true }, props.badge) : null
    );
  }

  /* ---------- Chip ---------- */
  function Chip(props) {
    var rest = omit(props, ['selected', 'icon', 'floating', 'className', 'children']);
    return h('button', Object.assign({}, rest, {
      type: 'button',
      'aria-pressed': !!props.selected,
      className: cx('gr-chip', props.floating && 'gr-chip-floating', props.className)
    }),
      props.icon ? h(Icon, { name: props.icon, size: 16 }) : null,
      props.children
    );
  }

  /* ---------- Badge ---------- */
  function Badge(props) {
    var tone = props.tone || 'neutral';
    return h('span', { className: cx('gr-badge', tone !== 'neutral' && 'gr-badge-' + tone, props.className) },
      props.icon ? h(Icon, { name: props.icon, size: 14, strokeWidth: 2 }) : null,
      props.children
    );
  }

  /* ---------- SearchBar ---------- */
  function SearchBar(props) {
    return h('div', { className: cx('gr-search', props.className), style: props.style },
      h(props.onSearch ? 'button' : 'div', props.onSearch
        ? { type: 'button', className: 'gr-search-main', onClick: props.onSearch, 'aria-label': 'Buscar: ' + props.place + ', ' + props.when }
        : { className: 'gr-search-main', style: { cursor: 'default' } },
        h(Icon, { name: 'search', size: 20 }),
        h('span', { className: 'gr-search-text' },
          h('span', { className: 'gr-search-place' }, props.place),
          h('span', { className: 'gr-search-when' }, props.when)
        )
      ),
      props.onFilters ? h('span', { className: 'gr-search-sep', 'aria-hidden': true }) : null,
      props.onFilters ? h(IconButton, { icon: 'sliders-horizontal', label: 'Filtros', badge: props.filterCount || 0, onClick: props.onFilters }) : null
    );
  }

  /* ---------- PricePin ---------- */
  function PricePin(props) {
    var price = formatBRL(props.price, { cents: false });
    var rest = omit(props, ['price', 'selected', 'unavailable', 'label', 'className']);
    var aria = (props.label ? props.label + ', ' : '') + price + ' por hora' + (props.unavailable ? ', indisponível no horário' : '');
    return h('button', Object.assign({}, rest, {
      type: 'button',
      'aria-label': aria,
      'aria-pressed': !!props.selected,
      className: cx('gr-pin', props.selected && 'gr-pin-selected', props.unavailable && 'gr-pin-unavailable', props.className)
    }), h('span', { className: 'gr-pin-body' }, price));
  }

  /* ---------- MapCanvas ---------- */
  /* A drawn neighbourhood: blocks on a slightly rotated grid, one diagonal avenue,
     two parks and a river. Decorative; the art covers 200% of the frame so the layer can pan. */
  var ART = null;
  function mapArt() {
    if (ART) return ART;
    var W = 800, H = 1600, bw = 74, bh = 54, gap = 10, k = 0;
    var blocks = [];
    for (var r = -6; r < 34; r++) {
      for (var c = -4; c < 14; c++) {
        var x = c * (bw + gap) + (c >= 4 ? 12 : 0) + (c >= 9 ? 12 : 0);
        var y = r * (bh + gap) + (r >= 12 ? 12 : 0) + (r >= 20 ? 12 : 0);
        blocks.push(h('rect', { key: 'b' + (k++), className: 'gr-map-land', x: x, y: y, width: bw, height: bh, rx: 4 }));
      }
    }
    ART = h('svg', { className: 'gr-map-art', viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true, focusable: 'false' },
      h('rect', { className: 'gr-map-road', x: 0, y: 0, width: W, height: H }),
      h('g', { transform: 'rotate(-9 400 800)' },
        blocks,
        h('rect', { className: 'gr-map-park', x: 4 * (bw + gap) + 12, y: 9 * (bh + gap), width: bw * 2 + gap, height: bh * 2 + gap, rx: 6 }),
        h('rect', { className: 'gr-map-park', x: 9 * (bw + gap) + 24, y: 16 * (bh + gap) + 12, width: bw, height: bh, rx: 6 }),
        h('rect', { className: 'gr-map-park', x: 1 * (bw + gap), y: 21 * (bh + gap) + 24, width: bw, height: bh * 2 + gap, rx: 6 })
      ),
      h('path', { className: 'gr-map-ave', d: 'M-40 520 L 860 1180', strokeWidth: 18 }),
      h('path', { className: 'gr-map-ave', d: 'M-60 1430 C 160 1330, 300 1460, 520 1360 S 760 1300, 880 1350', strokeWidth: 36 }),
      h('path', { className: 'gr-map-water', d: 'M-60 1430 C 160 1330, 300 1460, 520 1360 S 760 1300, 880 1350 L 880 1600 L -60 1600 Z', transform: 'translate(0 12)' })
    );
    return ART;
  }
  function MapCanvas(props) {
    var pins = props.pins || [];
    var off = props.offset || { x: 0, y: 0 };
    return h('div', {
      className: cx('gr-map', props.className), style: props.style,
      role: 'region', 'aria-label': props.ariaLabel || 'Mapa de carros disponíveis'
    },
      h('div', { className: 'gr-map-layer', style: { transform: 'translate3d(' + off.x + 'px,' + off.y + 'px,0)' } },
        mapArt(),
        props.me ? h('span', { className: 'gr-me', style: { left: props.me.x + '%', top: props.me.y + '%' }, role: 'img', 'aria-label': 'Você está aqui' }) : null,
        pins.map(function (p) {
          var sel = p.id === props.selectedId;
          return h('div', { key: p.id, className: cx('gr-map-marker', sel && 'gr-map-marker-selected'), style: { left: p.x + '%', top: p.y + '%' } },
            h(PricePin, { price: p.price, label: p.label, selected: sel, unavailable: p.unavailable, onClick: props.onSelect ? function () { props.onSelect(p.id); } : undefined })
          );
        })
      ),
      props.children
    );
  }

  /* ---------- BottomSheet ---------- */
  function BottomSheet(props) {
    return h('section', { className: cx('gr-sheet', props.className), style: props.style, 'aria-label': props.ariaLabel || props.title },
      props.onGrab
        ? h('button', { type: 'button', className: 'gr-sheet-grab', onClick: props.onGrab, 'aria-label': props.grabLabel || 'Expandir ou recolher', 'aria-expanded': props.expanded })
        : h('div', { className: 'gr-sheet-grab', 'aria-hidden': true }),
      (props.title || props.action) ? h('header', { className: 'gr-sheet-head' },
        h('div', { className: 'gr-sheet-titles' },
          props.title ? h('h2', { className: 'gr-sheet-title' }, props.title) : null,
          props.subtitle ? h('p', { className: 'gr-sheet-sub' }, props.subtitle) : null
        ),
        props.action || null
      ) : null,
      h('div', { className: 'gr-sheet-body' }, props.children),
      props.footer ? h('footer', { className: 'gr-sheet-foot' }, props.footer) : null
    );
  }

  /* ---------- CarCard ---------- */
  function CarCard(props) {
    var car = props.car;
    var detail = props.variant === 'detail';
    var features = [car.transmission, car.seats + ' lugares', car.energy].filter(Boolean);
    var tag = props.onClick ? 'button' : 'div';
    var attrs = {
      className: cx('gr-car', detail && 'gr-car-lg', car.unavailable && 'gr-car-off', props.className),
      onClick: props.onClick
    };
    if (props.onClick) attrs.type = 'button';
    return h(tag, attrs,
      h('span', { className: 'gr-car-thumb', 'aria-hidden': true },
        car.photo ? h('img', { src: car.photo, alt: '' }) : h(Icon, { name: 'car-front', size: detail ? 34 : 28, strokeWidth: 1.5 }),
        car.color ? h('span', { className: 'gr-car-swatch', style: { background: car.color }, title: car.colorName }) : null
      ),
      h('span', { className: 'gr-car-info' },
        h(detail && !props.onClick ? 'h3' : 'span', { className: 'gr-car-name' }, car.model, ' ', h('span', { className: 'gr-car-year' }, car.year)),
        h('span', { className: 'gr-car-meta' }, features.map(function (f, i) {
          return [i ? h('span', { key: 'd' + i, className: 'gr-dot', 'aria-hidden': true }) : null, h('span', { key: 'f' + i }, f)];
        })),
        h('span', { className: 'gr-car-meta' },
          car.rating ? [
            h(Icon, { key: 's', name: 'star', size: 14, filled: true, strokeWidth: 0 }),
            h('span', { key: 'r' }, formatRating(car.rating) + (car.trips ? ' (' + car.trips + ')' : '')),
            h('span', { key: 'd', className: 'gr-dot', 'aria-hidden': true })
          ] : null,
          car.unavailable
            ? h('span', { style: { color: 'var(--danger)' } }, 'Indisponível')
            : h('span', null, formatDistance(car.distance) + ' · ' + walkMinutes(car.distance) + ' min a pé')
        )
      ),
      h('span', { className: 'gr-car-price' },
        h('span', { className: 'gr-car-amount' }, formatBRL(car.price, { cents: false })),
        h('span', { className: 'gr-car-unit' }, 'por hora')
      )
    );
  }

  /* ---------- Stepper ---------- */
  function Stepper(props) {
    var min = props.min == null ? 1 : props.min;
    var max = props.max == null ? 24 : props.max;
    var step = props.step || 1;
    var v = props.value;
    var fmt = props.format || function (n) { return n + ' h'; };
    function set(n) { if (props.onChange) props.onChange(Math.min(max, Math.max(min, n))); }
    return h('div', { className: cx('gr-stepper', props.className), role: 'group', 'aria-label': props.label },
      h('div', { className: 'gr-stepper-label' },
        h('span', { className: 'gr-stepper-title' }, props.label),
        props.hint ? h('span', { className: 'gr-stepper-hint' }, props.hint) : null
      ),
      h('div', { className: 'gr-stepper-ctrl' },
        h(IconButton, { icon: 'minus', label: 'Diminuir', variant: 'outline', size: 'sm', disabled: v <= min, onClick: function () { set(v - step); } }),
        h('output', { className: 'gr-stepper-value', 'aria-live': 'polite' }, fmt(v)),
        h(IconButton, { icon: 'plus', label: 'Aumentar', variant: 'outline', size: 'sm', disabled: v >= max, onClick: function () { set(v + step); } })
      )
    );
  }

  /* ---------- PriceSummary ---------- */
  function PriceSummary(props) {
    return h('div', { className: props.className },
      h('dl', { className: 'gr-summary' },
        (props.items || []).map(function (it, i) {
          return h('div', { key: i, className: 'gr-summary-row' },
            h('dt', null, it.label, it.hint ? h('span', { className: 'gr-summary-hint' }, it.hint) : null),
            h('dd', null, formatBRL(it.value))
          );
        }),
        h('div', { className: 'gr-summary-row gr-summary-total' },
          h('dt', null, props.totalLabel || 'Total'),
          h('dd', null, formatBRL(props.total))
        )
      ),
      props.note ? h('p', { className: 'gr-summary-note' }, h(Icon, { name: 'info', size: 16 }), h('span', null, props.note)) : null
    );
  }

  var Giro = {
    Button: Button, IconButton: IconButton, Chip: Chip, Badge: Badge, Icon: Icon,
    SearchBar: SearchBar, PricePin: PricePin, MapCanvas: MapCanvas, BottomSheet: BottomSheet,
    CarCard: CarCard, Stepper: Stepper, PriceSummary: PriceSummary,
    formatBRL: formatBRL, formatDistance: formatDistance, walkMinutes: walkMinutes, formatRating: formatRating, calcPrice: calcPrice
  };
  window.Giro = Object.assign(window.Giro || {}, Giro);
})();
