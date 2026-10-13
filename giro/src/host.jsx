import { G, cx, brl, brl0, hoursText, dayLabel, addHours, today0 } from './util.js';
import { CarArt, TopBar, Section, Row, Radio, Switch, Stars, Avatar, EarningsChart } from './components.jsx';
import { CONFIG, EARNINGS_WEEKS, OWNER_UPCOMING, MODELS, COLORS, USER } from './data.js';

const { useState, useMemo } = React;

function weekLabels(n) {
  const out = [], d = today0();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // segunda desta semana
  for (let i = n - 1; i >= 0; i--) {
    const w = new Date(d); w.setDate(d.getDate() - i * 7);
    out.push(i === 0 ? 'Atual' : `${w.getDate()}/${w.getMonth() + 1}`);
  }
  return out;
}

export function Host({ app }) {
  const { state, nav } = app;
  const [editing, setEditing] = useState(null);
  const net = (v) => v * (1 - CONFIG.ownerCommission);
  const month = EARNINGS_WEEKS.slice(-4).reduce((a, b) => a + b, 0);
  const prev = EARNINGS_WEEKS.slice(0, 4).reduce((a, b) => a + b, 0);
  const growth = Math.round((month / prev - 1) * 100);
  const extra = state.myCars.length - 1;
  return (
    <div className="screen tab-screen">
      <header className="tab-head"><h1 className="display">Meus carros</h1></header>
      <div className="scroll">
        <div className="pad">
          <div className="earn">
            <span className="earn-label">Você recebeu nas últimas 4 semanas</span>
            <span className="earn-value">{brl(net(month))}</span>
            <span className="earn-delta"><G.Icon name="trending-up" size={16} /> {growth}% em relação às 4 semanas anteriores</span>
          </div>
          <EarningsChart weeks={EARNINGS_WEEKS.map(net)} labels={weekLabels(EARNINGS_WEEKS.length)} />
          <div className="stats">
            <div><span className="stat-v">23</span><span className="stat-l">reservas</span></div>
            <div><span className="stat-v">38%</span><span className="stat-l">ocupação</span></div>
            <div><span className="stat-v">4,9</span><span className="stat-l">nota média</span></div>
          </div>
          <p className="note"><G.Icon name="wallet" size={16} /> Repasse toda segunda-feira via Pix, já descontada a comissão de {Math.round(CONFIG.ownerCommission * 100)}%.</p>
        </div>

        <Section title="Próximas reservas">
          {OWNER_UPCOMING.map((r, i) => {
            const start = addHours(today0(), r.day * 24 + r.start);
            const car = state.myCars[0];
            return (
              <div className="host-res" key={i}>
                <Avatar name={r.who} size={40} />
                <span className="row-text">
                  <span className="row-label">{r.who} <span className="muted">· ★ {G.formatRating(r.rating)}</span></span>
                  <span className="row-sub">{dayLabel(start)} · {String(r.start).padStart(2, '0')}:00 · {hoursText(r.hours)}</span>
                </span>
                <span className="row-value">{brl0(net(G.calcPrice({ rate: car.price, hours: r.hours, dailyCap: car.dailyCap }).rental))}</span>
              </div>
            );
          })}
        </Section>

        <Section title="Seus anúncios" action={extra > 0 ? <span className="muted small">{state.myCars.length} carros</span> : null}>
          {state.myCars.map((c) => (
            <div className="listing" key={c.id}>
              <div className="listing-main">
                <span className="car-thumb car-thumb-lg"><CarArt car={c} ground={false} /></span>
                <span className="row-text">
                  <span className="row-label strong">{c.model} {c.year}</span>
                  <span className="row-sub">{brl0(c.price)}/h · diária {brl0(c.dailyCap)}</span>
                  <span className="row-sub">{c.active ? (c.trips ? `Disponível · ${c.trips} viagens` : 'Disponível · novo anúncio') : 'Pausado: não aparece no mapa'}</span>
                </span>
                <Switch checked={c.active} label={'Anúncio ativo: ' + c.model} onChange={(v) => { app.updateMyCar(c.id, { active: v }); app.toast(v ? 'Anúncio ativo no mapa' : 'Anúncio pausado'); }} />
              </div>
              {editing === c.id ? (
                <div className="listing-edit">
                  <G.Stepper label="Preço por hora" hint="Carros parecidos: veja a sugestão ao anunciar" value={c.price} min={8} max={80} onChange={(v) => app.updateMyCar(c.id, { price: v })} format={brl0} />
                  <G.Stepper label="Diária máxima" hint="Teto por 24 h" value={c.dailyCap} min={c.price} max={600} step={10} onChange={(v) => app.updateMyCar(c.id, { dailyCap: v })} format={brl0} />
                  <G.Button variant="secondary" block onClick={() => { setEditing(null); app.toast('Preço atualizado'); }}>Pronto</G.Button>
                </div>
              ) : (
                <div className="listing-actions">
                  <G.Button variant="secondary" onClick={() => setEditing(c.id)}>Editar preço</G.Button>
                  <G.Button variant="ghost" icon="map" onClick={() => app.showOnMap(c.id)}>Ver no mapa</G.Button>
                </div>
              )}
            </div>
          ))}
          <G.Button variant="secondary" block icon="plus" size="lg" onClick={() => nav.push('listcar')}>Anunciar outro carro</G.Button>
        </Section>
      </div>
    </div>
  );
}

/* ---------- List a new car (wizard) ---------- */
const STEPS = ['Carro', 'Fotos', 'Preço', 'Retirada'];
const SHOTS = ['Frente', 'Traseira', 'Lateral', 'Painel'];
const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function ListCar({ app }) {
  const { nav } = app;
  const [step, setStep] = useState(0);
  const [q, setQ] = useState('');
  const [model, setModel] = useState(null);
  const [year, setYear] = useState(2022);
  const [color, setColor] = useState(COLORS[1]);
  const [plate, setPlate] = useState('');
  const [shots, setShots] = useState({});
  const [price, setPrice] = useState(null);
  const [cap, setCap] = useState(null);
  const [pickup, setPickup] = useState('Cofre de chave');
  const [days, setDays] = useState({ Sáb: true, Dom: true, Seg: true, Ter: true, Qua: true, Qui: true, Sex: true });

  const m = MODELS.find((x) => x.model === model);
  const suggest = m ? m.suggest : [15, 20];
  const p = price != null ? price : Math.round((suggest[0] + suggest[1]) / 2);
  const c = cap != null ? cap : Math.round((p * 8) / 10) * 10;
  const car = { model: model || 'Seu carro', year, body: m ? m.body : 'hatch', color: color.hex, colorName: color.name };
  const plateOk = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate);
  const canNext = [!!model && plateOk, Object.keys(shots).length === SHOTS.length, true, Object.values(days).some(Boolean)][step];
  const models = MODELS.filter((x) => x.model.toLowerCase().includes(q.trim().toLowerCase()));
  const monthly = p * 40 * (1 - CONFIG.ownerCommission);

  function publish() {
    const id = 'meu-' + Date.now().toString(36);
    app.addMyCar({
      id, model, year, body: car.body, price: p, dailyCap: c, transmission: 'Automático', seats: 5, energy: 'Flex',
      rating: 5.0, trips: 0, color: color.hex, colorName: color.name, owner: 'Marina C.', ownerSince: '2026', ownerResp: '~10 min',
      pickup, street: 'Rua Ferreira de Araújo', east: 180 + Math.round(Math.random() * 300), north: -380 - Math.round(Math.random() * 300), mine: true, active: true
    });
    nav.replace('listed', { id });
  }

  return (
    <div className="screen">
      <TopBar title="Anunciar carro" sub={`Passo ${step + 1} de ${STEPS.length} · ${STEPS[step]}`} onBack={step ? () => setStep(step - 1) : nav.pop} />
      <div className="progress" aria-hidden="true"><span style={{ width: ((step + 1) / STEPS.length) * 100 + '%' }} /></div>
      <div className="scroll pad">
        {step === 0 ? (
          <>
            <h2 className="title-lg">Qual é o seu carro?</h2>
            <div className="search-field flush">
              <G.Icon name="search" size={20} />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Modelo" aria-label="Buscar modelo" />
            </div>
            <div className="model-list" role="radiogroup" aria-label="Modelo">
              {models.map((x) => (
                <button key={x.model} type="button" role="radio" aria-checked={model === x.model} className={cx('place', model === x.model && 'place-on')} onClick={() => setModel(x.model)}>
                  <span className="row-text"><span className="row-label">{x.model}</span></span>
                  {model === x.model ? <G.Icon name="check" size={20} className="place-check" /> : null}
                </button>
              ))}
            </div>
            <h3 className="label-title flush">Ano</h3>
            <div className="hscroll flush">{[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => <G.Chip key={y} selected={y === year} onClick={() => setYear(y)}>{y}</G.Chip>)}</div>
            <h3 className="label-title flush">Cor</h3>
            <div className="hscroll flush">{COLORS.map((x) => (
              <G.Chip key={x.name} selected={x.name === color.name} onClick={() => setColor(x)}><span className="swatch" style={{ background: x.hex }} />{x.name}</G.Chip>
            ))}</div>
            <h3 className="label-title flush">Placa</h3>
            <input className="input" value={plate} maxLength={7} onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="ABC1D23" aria-label="Placa" aria-invalid={plate.length === 7 && !plateOk} />
            <p className="note">{plate.length === 7 && !plateOk ? 'Placa inválida. Use o formato Mercosul (ABC1D23) ou antigo (ABC1234).' : 'Usamos a placa para checar documentação e multas. Ela não aparece no anúncio.'}</p>
          </>
        ) : step === 1 ? (
          <>
            <h2 className="title-lg">Fotos do {model}</h2>
            <p className="muted">Fotos claras, de dia, alugam até 2 vezes mais. Toque para adicionar.</p>
            <div className="shots">
              {SHOTS.map((s, i) => (
                <button key={s} type="button" className={cx('shot', shots[s] && 'shot-done')} onClick={() => setShots((x) => ({ ...x, [s]: true }))} aria-label={'Adicionar foto: ' + s}>
                  {shots[s] ? <><CarArt car={car} ground={false} className={cx('shot-art', i === 1 && 'flip', i >= 2 && 'zoom')} /><span className="shot-ok"><G.Icon name="check" size={14} strokeWidth={2.5} /></span></> : <G.Icon name="camera" size={24} />}
                  <span className="shot-label">{s}</span>
                </button>
              ))}
            </div>
          </>
        ) : step === 2 ? (
          <>
            <h2 className="title-lg">Quanto cobrar por hora?</h2>
            <div className="suggest"><G.Icon name="info" size={16} /> {model} {year} em Pinheiros: <strong>{brl0(suggest[0])} a {brl0(suggest[1])}/h</strong></div>
            <div className="big-stepper">
              <G.Stepper label="Preço por hora" value={p} min={8} max={80} onChange={setPrice} format={brl0} />
              <G.Stepper label="Diária máxima" hint="Teto por 24 h de aluguel" value={c} min={p} max={600} step={10} onChange={setCap} format={brl0} />
            </div>
            <div className="estimate">
              <span className="earn-label">Alugando 40 horas por mês, você recebe cerca de</span>
              <span className="earn-value">{brl0(monthly)}</span>
              <span className="muted small">Já descontada a comissão de {Math.round(CONFIG.ownerCommission * 100)}%. A proteção é paga por quem aluga.</span>
            </div>
          </>
        ) : (
          <>
            <h2 className="title-lg">Como a pessoa pega a chave?</h2>
            {['Cofre de chave', 'Chave na portaria', 'Entrega em mãos'].map((k) => (
              <Radio key={k} name="pickup" checked={pickup === k} onChange={() => setPickup(k)} label={k}
                sub={k === 'Cofre de chave' ? 'Sem encontro. O código vai para quem reservou.' : k === 'Chave na portaria' ? 'Deixe a chave com a portaria do prédio.' : 'Você entrega pessoalmente.'} />
            ))}
            <h3 className="label-title flush">Dias disponíveis</h3>
            <div className="days">{DAYS.map((d) => <G.Chip key={d} selected={!!days[d]} onClick={() => setDays((x) => ({ ...x, [d]: !x[d] }))}>{d}</G.Chip>)}</div>
            <div className="card review-card">
              <span className="car-thumb car-thumb-lg"><CarArt car={car} ground={false} /></span>
              <span className="row-text">
                <span className="row-label strong">{model} {year}</span>
                <span className="row-sub">{brl0(p)}/h · diária {brl0(c)} · {pickup}</span>
              </span>
            </div>
          </>
        )}
      </div>
      <footer className="screen-foot">
        {step < STEPS.length - 1
          ? <G.Button size="lg" block disabled={!canNext} onClick={() => setStep(step + 1)}>Continuar</G.Button>
          : <G.Button size="lg" block disabled={!canNext} onClick={publish}>Publicar anúncio</G.Button>}
      </footer>
    </div>
  );
}

export function Listed({ app, params }) {
  const car = app.carById(params.id);
  return (
    <div className="screen confirmed">
      <div className="scroll pad">
        <div className="confirmed-hero">
          <span className="big-check"><G.Icon name="check" size={40} strokeWidth={2.25} /></span>
          <h1 className="display">Seu carro está no mapa</h1>
          <p className="muted">Quem estiver perto já pode reservar o {car.model} por {brl0(car.price)}/h. Avisamos você a cada pedido.</p>
        </div>
        <CarArt car={car} className="confirmed-art" />
      </div>
      <footer className="screen-foot stack">
        <G.Button size="lg" block icon="map" onClick={() => app.showOnMap(car.id)}>Ver no mapa</G.Button>
        <G.Button variant="ghost" block onClick={() => app.nav.home('host')}>Ir para Meus carros</G.Button>
      </footer>
    </div>
  );
}
