import { G, cx, brl0 } from './util.js';

const { useState, useEffect, useRef } = React;

/* ---------- Car illustration (side view, front to the left) ---------- */
const BODIES = {
  hatch: {
    body: 'M18 96 C18 84 24 76 40 73 L96 66 L132 40 C136 37 140 36 146 36 L238 36 C246 36 252 40 256 46 L288 70 C296 74 300 80 300 90 L300 100 C300 104 297 106 293 106 L264 106 A26 26 0 0 0 212 106 L104 106 A26 26 0 0 0 52 106 L24 106 C20 106 18 103 18 100 Z',
    glass: ['M106 66 L137 44 C139 42 142 41 146 41 L184 41 L184 66 Z', 'M192 41 L236 41 C242 41 246 44 249 48 L272 66 L192 66 Z'],
    wheels: [78, 238], r: 22, door: 'M188 70 L188 100', handle: [200, 76], light: [[22, 80, 14, 6], [286, 76, 12, 7]]
  },
  sedan: {
    body: 'M16 96 C16 84 22 76 38 73 L94 66 L132 40 C136 37 140 36 146 36 L220 36 C228 36 234 40 238 44 L262 64 L292 68 C298 70 304 78 304 88 L304 100 C304 104 301 106 297 106 L266 106 A26 26 0 0 0 214 106 L102 106 A26 26 0 0 0 50 106 L22 106 C18 106 16 103 16 100 Z',
    glass: ['M104 66 L136 44 C138 42 141 41 145 41 L180 41 L180 66 Z', 'M188 41 L218 41 C224 41 229 43 232 47 L250 64 L188 66 Z'],
    wheels: [76, 240], r: 22, door: 'M184 70 L184 100', handle: [196, 76], light: [[20, 80, 14, 6], [290, 74, 12, 7]]
  },
  suv: {
    body: 'M16 96 C16 82 22 72 38 68 L92 60 L124 30 C128 27 132 26 138 26 L272 26 C282 26 288 30 290 38 L298 64 C302 70 304 78 304 88 L304 100 C304 104 301 106 297 106 L266 106 A28 28 0 0 0 210 106 L106 106 A28 28 0 0 0 50 106 L22 106 C18 106 16 103 16 100 Z',
    glass: ['M102 60 L130 34 C133 32 136 31 140 31 L188 31 L188 60 Z', 'M196 31 L270 31 C276 31 280 34 282 40 L288 60 L196 60 Z'],
    wheels: [78, 238], r: 24, door: 'M192 64 L192 100', handle: [204, 70], light: [[20, 76, 14, 7], [290, 70, 10, 9]]
  }
};

export function CarArt({ car, className, ground = true }) {
  const b = BODIES[car.body] || BODIES.hatch;
  return (
    <svg className={cx('car-art', className)} viewBox="0 0 320 132" role="img" aria-label={`${car.model} ${car.colorName ? car.colorName.toLowerCase() : ''}`}>
      {ground ? <ellipse cx="160" cy="114" rx="146" ry="8" className="car-art-shadow" /> : null}
      <path d={b.body} fill={car.color} className="car-art-body" />
      <path d={b.body} fill="url(#car-art-shade)" />
      {b.glass.map((d, i) => <path key={i} d={d} className="car-art-glass" />)}
      <path d={b.door} className="car-art-line" />
      <rect x={b.handle[0]} y={b.handle[1]} width="12" height="3" rx="1.5" className="car-art-line-fill" />
      <rect x={b.light[0][0]} y={b.light[0][1]} width={b.light[0][2]} height={b.light[0][3]} rx="3" className="car-art-head" />
      <rect x={b.light[1][0]} y={b.light[1][1]} width={b.light[1][2]} height={b.light[1][3]} rx="3" className="car-art-tail" />
      {b.wheels.map((x) => (
        <g key={x}>
          <circle cx={x} cy="106" r={b.r} className="car-art-tire" />
          <circle cx={x} cy="106" r={b.r * 0.5} className="car-art-rim" />
          <circle cx={x} cy="106" r="3" className="car-art-tire" />
        </g>
      ))}
    </svg>
  );
}
/* Shared gradient for the body shading (rendered once by the app shell). */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="car-art-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".22" />
          <stop offset=".55" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity=".18" />
        </linearGradient>
      </defs>
    </svg>
  );
}
/* The same illustration as an <img> source, for components that take a photo URL (CarCard). */
export function carPhoto(car) {
  const b = BODIES[car.body] || BODIES.hatch;
  const r = (x) => `<rect x="${x[0]}" y="${x[1]}" width="${x[2]}" height="${x[3]}" rx="3"`;
  const wheels = b.wheels.map((x) => `<circle cx="${x}" cy="106" r="${b.r}" fill="#1d1e21"/><circle cx="${x}" cy="106" r="${b.r * 0.5}" fill="#a9acb1" stroke="#6d7076" stroke-width="1.5"/><circle cx="${x}" cy="106" r="3" fill="#1d1e21"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -20 340 160"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>`
    + `<path d="${b.body}" fill="${car.color}" stroke="#0000002e"/><path d="${b.body}" fill="url(#s)"/>`
    + b.glass.map((d) => `<path d="${d}" fill="#1f2a33" fill-opacity=".88"/>`).join('')
    + `<path d="${b.door}" stroke="#00000038" stroke-width="1.5"/>${r(b.light[0])} fill="#fff6d6"/>${r(b.light[1])} fill="#c4321b"/>${wheels}</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export function CarThumb({ car, size = 'md' }) {
  return <span className={cx('car-thumb', 'car-thumb-' + size)}><CarArt car={car} ground={false} /></span>;
}

/* ---------- Layout pieces ---------- */
export function TopBar({ title, onBack, right, transparent, sub }) {
  return (
    <header className={cx('topbar', transparent && 'topbar-clear')}>
      {onBack ? <G.IconButton icon="chevron-left" label="Voltar" variant={transparent ? 'floating' : 'plain'} onClick={onBack} /> : <span className="topbar-gap" />}
      {title ? (
        <div className="topbar-titles">
          <h1 className="topbar-title">{title}</h1>
          {sub ? <p className="topbar-sub">{sub}</p> : null}
        </div>
      ) : <span className="topbar-fill" />}
      {right || <span className="topbar-gap" />}
    </header>
  );
}

export function Section({ title, children, action, className }) {
  return (
    <section className={cx('section', className)}>
      {title ? <div className="section-head"><h2 className="section-title">{title}</h2>{action}</div> : null}
      {children}
    </section>
  );
}

export function Row({ icon, label, value, sub, onClick, right, tone }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={cx('row', onClick && 'row-btn')} onClick={onClick} type={onClick ? 'button' : undefined}>
      {icon ? <span className={cx('row-icon', tone && 'row-icon-' + tone)}><G.Icon name={icon} size={20} /></span> : null}
      <span className="row-text">
        <span className="row-label">{label}</span>
        {sub ? <span className="row-sub">{sub}</span> : null}
      </span>
      {value ? <span className="row-value">{value}</span> : null}
      {right}
      {onClick && !right ? <G.Icon name="chevron-right" size={18} className="row-chev" /> : null}
    </Tag>
  );
}

export function Radio({ checked, onChange, label, sub, right, name }) {
  return (
    <label className={cx('radio', checked && 'radio-on')}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="radio-dot" aria-hidden="true" />
      <span className="row-text">
        <span className="row-label">{label}</span>
        {sub ? <span className="row-sub">{sub}</span> : null}
      </span>
      {right ? <span className="row-value">{right}</span> : null}
    </label>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={cx('switch', checked && 'switch-on')} onClick={() => onChange(!checked)}>
      <span className="switch-knob" />
    </button>
  );
}

export function Stars({ value, size = 14 }) {
  return (
    <span className="stars" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => <G.Icon key={i} name="star" size={size} filled={i <= Math.round(value)} strokeWidth={i <= Math.round(value) ? 0 : 1.5} />)}
    </span>
  );
}

export function Avatar({ name, size = 40 }) {
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return <span className="avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }} aria-hidden="true">{initials}</span>;
}

/* ---------- Toast ---------- */
export function Toast({ message }) {
  return message ? <div className="toast" role="status" key={message.id}>{message.text}</div> : null;
}

/* ---------- Weekly earnings bars (single series, current week emphasised) ---------- */
export function EarningsChart({ weeks, labels }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...weeks) * 1.1;
  const W = 326, H = 120, gap = 10, bw = (W - gap * (weeks.length - 1)) / weeks.length;
  return (
    <figure className="chart">
      <div className="chart-plot">
        <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" role="img" aria-label={'Ganhos por semana: ' + weeks.map((v, i) => labels[i] + ' ' + brl0(v)).join(', ')}>
          <line x1="0" x2={W} y1={H} y2={H} className="chart-base" />
          {weeks.map((v, i) => {
            const h = Math.max(4, (v / max) * H), x = i * (bw + gap), last = i === weeks.length - 1;
            return (
              <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={labels[i] + ': ' + brl0(v)}>
                <rect x={x - gap / 2} y="0" width={bw + gap} height={H + 20} fill="transparent" />
                <path d={`M${x} ${H} V${H - h + 4} Q${x} ${H - h} ${x + 4} ${H - h} H${x + bw - 4} Q${x + bw} ${H - h} ${x + bw} ${H - h + 4} V${H} Z`} className={cx('chart-bar', last && 'chart-bar-now', hover === i && 'chart-bar-hover')} />
                <text x={x + bw / 2} y={H + 15} textAnchor="middle" className="chart-label">{labels[i]}</text>
              </g>
            );
          })}
        </svg>
        {hover != null ? (
          <div className="chart-tip" style={{ left: `${((hover + 0.5) / weeks.length) * 100}%` }}>
            <strong>{brl0(weeks[hover])}</strong><span>{labels[hover] === 'Atual' ? 'esta semana' : 'semana de ' + labels[hover]}</span>
          </div>
        ) : null}
      </div>
    </figure>
  );
}

/* ---------- Pseudo QR (demonstration only) ---------- */
export function DemoQR({ seed = 7 }) {
  const N = 29, cells = [];
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const finder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.52) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
  const F = ({ x, y }) => (
    <g>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" className="qr-bg" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg className="qr" viewBox={`-2 -2 ${N + 4} ${N + 4}`} role="img" aria-label="QR code Pix de demonstração" shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={N + 4} height={N + 4} className="qr-bg" />
      {cells}
      <F x={0} y={0} /><F x={N - 7} y={0} /><F x={0} y={N - 7} />
    </svg>
  );
}

/* ---------- Countdown hook ---------- */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

export function useAutoFocus() {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  return ref;
}
