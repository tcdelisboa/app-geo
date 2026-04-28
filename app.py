import random
import streamlit as st

# =====================================================
# CONFIGURAÇÃO DA PÁGINA
# =====================================================
st.set_page_config(
    page_title="Simulador Demográfico de Portugal",
    page_icon="🏛️",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# =====================================================
# CSS - VISUAL MOBILE FIRST
# =====================================================
st.markdown(
    """
<style>
    .stApp {
        background: #0f172a;
        color: #e5e7eb;
        font-family: Arial, Helvetica, sans-serif;
    }

    header, footer, #MainMenu {
        visibility: hidden;
    }

    .block-container {
        max-width: 760px;
        padding-top: 1rem;
        padding-bottom: 2rem;
    }

    .main-title {
        text-align: center;
        font-size: 2rem;
        font-weight: 900;
        color: #f8fafc;
        margin-top: 0.5rem;
    }

    .subtitle {
        text-align: center;
        color: #94a3b8;
        font-size: 1rem;
        line-height: 1.5;
        margin: 0.75rem 0 1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 1rem 0;
    }

    @media (min-width: 640px) {
        .stats-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .stat-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 14px;
        padding: 12px;
        text-align: center;
    }

    .stat-value {
        font-size: 1.2rem;
        font-weight: 900;
        color: #f8fafc;
        word-break: break-word;
    }

    .stat-label {
        margin-top: 4px;
        font-size: 0.72rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .positive { color: #22c55e !important; }
    .negative { color: #ef4444 !important; }
    .warning { color: #f59e0b !important; }
    .info { color: #60a5fa !important; }

    .progress-wrap {
        display: flex;
        justify-content: center;
        gap: 5px;
        margin: 1rem 0;
    }

    .step {
        flex: 1;
        max-width: 42px;
        height: 7px;
        border-radius: 999px;
        background: #334155;
    }

    .step.done { background: #22c55e; }
    .step.active { background: #6366f1; }

    .story-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 18px;
        padding: 22px;
        margin: 1rem 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.18);
    }

    .story-card.event-good {
        background: #052e1a;
        border-color: #22c55e;
    }

    .story-card.event-bad {
        background: #3b0a0a;
        border-color: #ef4444;
    }

    .story-card.event-neutral {
        background: #2a1c04;
        border-color: #f59e0b;
    }

    .story-icon {
        display: block;
        text-align: center;
        font-size: 3rem;
        margin-bottom: 10px;
    }

    .story-title {
        text-align: center;
        font-size: 1.45rem;
        font-weight: 900;
        color: #f8fafc;
        margin-bottom: 10px;
    }

    .story-text {
        text-align: center;
        color: #cbd5e1;
        line-height: 1.65;
        font-size: 1rem;
    }

    .choice-card {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 15px;
        margin: 0.75rem 0;
        text-align: left;
    }

    .choice-title {
        color: #f8fafc;
        font-size: 1.08rem;
        font-weight: 900;
        margin-bottom: 6px;
    }

    .choice-desc {
        color: #94a3b8;
        line-height: 1.5;
        font-size: 0.95rem;
        margin-bottom: 10px;
    }

    .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
    }

    .tag {
        background: #1e293b;
        border: 1px solid #334155;
        color: #cbd5e1;
        border-radius: 999px;
        padding: 5px 8px;
        font-size: 0.76rem;
        font-weight: 900;
    }

    .result-title {
        text-align: center;
        font-size: 1.6rem;
        font-weight: 900;
        margin: 0.5rem 0;
    }

    .final-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 1rem;
    }

    .final-box {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 14px;
        padding: 14px;
        text-align: center;
    }

    .final-box strong {
        display: block;
        color: #f8fafc;
        font-size: 1.15rem;
        margin-bottom: 4px;
    }

    .final-box span {
        color: #94a3b8;
        font-size: 0.85rem;
    }

    .timeline-title {
        text-align: center;
        color: #f8fafc;
        font-size: 1.35rem;
        font-weight: 900;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
    }

    .timeline-item {
        border-left: 3px solid #6366f1;
        padding: 8px 0 8px 12px;
        margin-bottom: 8px;
        color: #cbd5e1;
        line-height: 1.45;
    }

    .stButton > button {
        width: 100%;
        border: none !important;
        border-radius: 12px !important;
        padding: 0.9rem 1rem !important;
        font-size: 1rem !important;
        font-weight: 900 !important;
        color: white !important;
        background: #6366f1 !important;
        min-height: 50px !important;
    }

    .stButton > button:hover {
        background: #4f46e5 !important;
        color: white !important;
    }

    .footer-note {
        text-align: center;
        color: #64748b;
        font-size: 0.82rem;
        padding: 24px 0;
    }
</style>
""",
    unsafe_allow_html=True,
)

# =====================================================
# DADOS DO JOGO
# =====================================================
PHASES = [
    {
        "icon": "🇵🇹",
        "title": "O País que Vais Governar",
        "text": "Portugal enfrenta baixa natalidade, população envelhecida, saída de jovens, pressão sobre a Segurança Social e necessidade de atrair trabalhadores. O teu objetivo é equilibrar crescimento populacional, qualidade de vida e sustentabilidade financeira.",
        "choices": [
            {
                "title": "Começar mandato",
                "description": "Assumir o cargo e iniciar as decisões demográficas.",
                "effects": {},
                "note": "Início do mandato como Chefe de Estado.",
            }
        ],
    },
    {
        "icon": "👶",
        "title": "Medidas de Natalidade",
        "text": "A natalidade está baixa. Muitas famílias adiam ter filhos por dificuldades económicas, habitação cara e falta de apoio à infância.",
        "choices": [
            {
                "title": "Apoios financeiros às famílias",
                "description": "Subsídios por filho, creches mais baratas e benefícios fiscais para famílias jovens.",
                "effects": {"money": -12000, "population": 12, "happiness": 10, "reputation": 8, "ageing": -6},
                "note": "Foram criados apoios à natalidade e às famílias jovens.",
            },
            {
                "title": "Campanha simbólica de incentivo",
                "description": "Campanhas públicas sobre natalidade, mas com pouco investimento real.",
                "effects": {"money": -3000, "population": 4, "happiness": 2, "reputation": 2, "ageing": -2},
                "note": "O governo lançou uma campanha de incentivo à natalidade.",
            },
            {
                "title": "Não intervir",
                "description": "Evitas despesa pública, mas o problema continua a crescer.",
                "effects": {"money": 5000, "population": -6, "happiness": -7, "reputation": -10, "ageing": 8},
                "note": "O governo decidiu não aplicar medidas fortes de natalidade.",
            },
        ],
    },
    {
        "icon": "🏠",
        "title": "Habitação e Jovens",
        "text": "Muitos jovens saem de casa tarde, adiam projetos familiares ou emigram por falta de habitação acessível.",
        "choices": [
            {
                "title": "Programa de habitação acessível",
                "description": "Construção e incentivos ao arrendamento para jovens e famílias.",
                "effects": {"money": -15000, "population": 8, "happiness": 14, "reputation": 12, "employment": 6, "ageing": -4},
                "note": "Foi criado um programa nacional de habitação acessível.",
            },
            {
                "title": "Incentivos fiscais a proprietários",
                "description": "Menos impostos para quem arrendar a preços controlados.",
                "effects": {"money": -7000, "population": 5, "happiness": 7, "reputation": 6, "employment": 3, "ageing": -2},
                "note": "Foram aprovados incentivos fiscais para arrendamento acessível.",
            },
            {
                "title": "Deixar o mercado resolver",
                "description": "Poupa dinheiro, mas pode aumentar frustração social.",
                "effects": {"money": 6000, "population": -6, "happiness": -12, "reputation": -12, "employment": -2, "ageing": 5},
                "note": "O governo deixou a habitação ao funcionamento do mercado.",
            },
        ],
    },
    {
        "icon": "🌍",
        "title": "Política de Imigração",
        "text": "Portugal precisa de trabalhadores em vários setores. A imigração pode equilibrar a população ativa, mas exige integração, habitação, escola e saúde.",
        "choices": [
            {
                "title": "Facilitar imigração com integração",
                "description": "Entrada de trabalhadores acompanhada por cursos de língua, apoio local e integração profissional.",
                "effects": {"money": -10000, "population": 18, "employment": 12, "happiness": 2, "reputation": 8, "ageing": -10},
                "note": "Portugal abriu vias de imigração com programas de integração.",
            },
            {
                "title": "Facilitar imigração sem grande apoio",
                "description": "A população ativa aumenta, mas a pressão sobre serviços públicos também cresce.",
                "effects": {"money": -2000, "population": 16, "employment": 7, "happiness": -8, "reputation": -3, "ageing": -8},
                "note": "A imigração aumentou, mas a integração ficou limitada.",
            },
            {
                "title": "Restringir fortemente a imigração",
                "description": "Reduz pressão imediata, mas agrava falta de trabalhadores e envelhecimento.",
                "effects": {"money": 4000, "population": -10, "employment": -10, "happiness": 2, "reputation": -8, "ageing": 12},
                "note": "Portugal restringiu a imigração de forma forte.",
            },
        ],
    },
    {
        "icon": "💼",
        "title": "Emprego e Retenção de Jovens",
        "text": "A saída de jovens qualificados enfraquece a economia e reduz a natalidade futura. É preciso criar oportunidades no país.",
        "choices": [
            {
                "title": "Investir em salários e inovação",
                "description": "Apoios a empresas inovadoras, ciência, tecnologia e emprego qualificado.",
                "effects": {"money": -14000, "employment": 16, "happiness": 10, "reputation": 10, "population": 7, "ageing": -5},
                "note": "O governo investiu em inovação e retenção de jovens qualificados.",
            },
            {
                "title": "Baixar impostos às empresas",
                "description": "Pode atrair investimento, mas o efeito social não é imediato.",
                "effects": {"money": -9000, "employment": 10, "happiness": 4, "reputation": 4, "population": 3, "ageing": -2},
                "note": "Foram reduzidos impostos para tentar criar emprego.",
            },
            {
                "title": "Cortar investimento público",
                "description": "Melhora o orçamento no curto prazo, mas incentiva emigração jovem.",
                "effects": {"money": 12000, "employment": -10, "happiness": -14, "reputation": -14, "population": -8, "ageing": 7},
                "note": "O governo cortou investimento público para poupar dinheiro.",
            },
        ],
    },
    {
        "icon": "👵",
        "title": "Envelhecimento e Segurança Social",
        "text": "A população idosa cresce. É necessário decidir como financiar pensões, saúde e apoio social.",
        "choices": [
            {
                "title": "Reforçar saúde e apoio aos idosos",
                "description": "Mais cuidados continuados, lares, saúde preventiva e combate ao isolamento.",
                "effects": {"money": -13000, "happiness": 12, "reputation": 11, "ageing": -2},
                "note": "O apoio social e de saúde aos idosos foi reforçado.",
            },
            {
                "title": "Reforma gradual da idade da reforma",
                "description": "Mantém mais pessoas ativas, mas pode gerar contestação social.",
                "effects": {"money": 7000, "employment": 8, "happiness": -6, "reputation": -5, "ageing": -3},
                "note": "Foi feita uma reforma gradual da idade da reforma.",
            },
            {
                "title": "Cortar despesas sociais",
                "description": "Poupa dinheiro, mas reduz bem-estar e confiança no Estado.",
                "effects": {"money": 15000, "happiness": -20, "reputation": -20, "ageing": 4},
                "note": "O governo cortou despesas sociais ligadas aos idosos.",
            },
        ],
    },
    {
        "icon": "📚",
        "title": "Educação e Futuro da População",
        "text": "A qualidade da educação influencia produtividade, igualdade de oportunidades, integração de imigrantes e capacidade do país crescer no futuro.",
        "choices": [
            {
                "title": "Investir forte na escola pública",
                "description": "Mais professores, melhores escolas, apoio a alunos e integração linguística.",
                "effects": {"money": -12000, "happiness": 9, "reputation": 9, "employment": 10, "population": 3},
                "note": "Foi feito um investimento forte na escola pública.",
            },
            {
                "title": "Apoiar formação profissional",
                "description": "Cursos técnicos para jovens, desempregados e imigrantes.",
                "effects": {"money": -7000, "employment": 12, "happiness": 5, "reputation": 6, "population": 2},
                "note": "O governo apostou na formação profissional.",
            },
            {
                "title": "Manter tudo como está",
                "description": "Evitas despesa, mas perdes oportunidade de melhorar o futuro.",
                "effects": {"money": 3000, "employment": -4, "happiness": -4, "reputation": -5},
                "note": "A educação ficou praticamente sem novas medidas.",
            },
        ],
    },
]

RANDOM_EVENTS = [
    {
        "type": "bad",
        "icon": "📉",
        "title": "Crise económica europeia",
        "text": "A economia abranda, o desemprego sobe e o orçamento público fica sob pressão.",
        "effects": {"money": -12000, "reputation": -10, "happiness": -12, "employment": -10, "population": -3},
        "note": "Uma crise económica afetou o mandato.",
    },
    {
        "type": "good",
        "icon": "🚀",
        "title": "Boom tecnológico em Portugal",
        "text": "Novas empresas instalam-se no país. Há mais emprego qualificado e jovens decidem ficar.",
        "effects": {"money": 14000, "reputation": 10, "happiness": 8, "employment": 14, "population": 6, "ageing": -3},
        "note": "Um boom tecnológico ajudou a economia e reteve jovens.",
    },
    {
        "type": "neutral",
        "icon": "📢",
        "title": "Protestos sociais",
        "text": "Parte da população discorda das medidas. A pressão pública aumenta.",
        "effects": {"reputation": -14, "happiness": -10, "money": -3000},
        "note": "Protestos sociais marcaram o mandato.",
    },
    {
        "type": "good",
        "icon": "👨‍👩‍👧‍👦",
        "title": "Aumento inesperado da natalidade",
        "text": "As famílias respondem positivamente ao clima social e económico.",
        "effects": {"population": 10, "happiness": 6, "reputation": 6, "ageing": -8},
        "note": "A natalidade teve uma melhoria inesperada.",
    },
    {
        "type": "bad",
        "icon": "✈️",
        "title": "Nova vaga de emigração jovem",
        "text": "Muitos jovens qualificados saem do país à procura de melhores salários.",
        "effects": {"population": -9, "employment": -7, "reputation": -8, "happiness": -7, "ageing": 8},
        "note": "Uma vaga de emigração jovem prejudicou o país.",
    },
    {
        "type": "neutral",
        "icon": "🏥",
        "title": "Pressão no Serviço Nacional de Saúde",
        "text": "O envelhecimento e o crescimento populacional aumentam filas e custos de saúde.",
        "effects": {"money": -8000, "happiness": -8, "reputation": -6},
        "note": "O sistema de saúde ficou sob pressão.",
    },
]

# =====================================================
# TESTES SIMPLES
# =====================================================
def clamp(value):
    return max(0, min(100, value))


def apply_effects_to_test_state(state, effects, note=None):
    new_state = state.copy()
    new_state["history"] = list(state.get("history", []))
    new_state["money"] += effects.get("money", 0)
    new_state["reputation"] = clamp(new_state["reputation"] + effects.get("reputation", 0))
    new_state["population"] = clamp(new_state["population"] + effects.get("population", 0))
    new_state["ageing"] = clamp(new_state["ageing"] + effects.get("ageing", 0))
    new_state["happiness"] = clamp(new_state["happiness"] + effects.get("happiness", 0))
    new_state["employment"] = clamp(new_state["employment"] + effects.get("employment", 0))
    if note:
        new_state["history"].append(note)
    new_state["phase"] += 1
    return new_state


def final_result_for_test_state(state):
    score = state["reputation"] + state["population"] + state["happiness"] + state["employment"] - state["ageing"]
    if state["money"] < -15000:
        return "País Endividado"
    if score >= 210:
        return "Renascimento Demográfico"
    if score >= 165:
        return "Estabilidade com Desafios"
    if score >= 125:
        return "Futuro Incerto"
    return "Crise Demográfica Grave"


def run_tests():
    state = {
        "phase": 0,
        "money": 50000,
        "reputation": 50,
        "population": 50,
        "ageing": 55,
        "happiness": 50,
        "employment": 45,
        "history": [],
    }
    updated = apply_effects_to_test_state(
        state,
        {"money": -1000, "reputation": 60, "population": 70, "ageing": -100, "happiness": -90, "employment": 10},
        "Teste",
    )
    assert updated["money"] == 49000
    assert updated["reputation"] == 100
    assert updated["population"] == 100
    assert updated["ageing"] == 0
    assert updated["happiness"] == 0
    assert updated["employment"] == 55
    assert updated["phase"] == 1
    assert updated["history"] == ["Teste"]

    rich_state = state.copy()
    rich_state.update({"money": 10000, "reputation": 90, "population": 90, "happiness": 90, "employment": 90, "ageing": 30})
    assert final_result_for_test_state(rich_state) == "Renascimento Demográfico"

    debt_state = state.copy()
    debt_state["money"] = -20000
    assert final_result_for_test_state(debt_state) == "País Endividado"


run_tests()

# =====================================================
# FUNÇÕES DO JOGO
# =====================================================
def init_game():
    st.session_state.phase = 0
    st.session_state.money = 50000
    st.session_state.reputation = 50
    st.session_state.population = 50
    st.session_state.ageing = 55
    st.session_state.happiness = 50
    st.session_state.employment = 45
    st.session_state.history = []
    st.session_state.random_event = None


def money_text(value):
    return f"{value:,.0f}€".replace(",", ".")


def apply_effects(effects, note):
    st.session_state.money += effects.get("money", 0)
    st.session_state.reputation = clamp(st.session_state.reputation + effects.get("reputation", 0))
    st.session_state.population = clamp(st.session_state.population + effects.get("population", 0))
    st.session_state.ageing = clamp(st.session_state.ageing + effects.get("ageing", 0))
    st.session_state.happiness = clamp(st.session_state.happiness + effects.get("happiness", 0))
    st.session_state.employment = clamp(st.session_state.employment + effects.get("employment", 0))

    if note:
        st.session_state.history.append(note)

    st.session_state.phase += 1
    st.rerun()


def metric_class(key, value):
    if key == "ageing":
        return "negative" if value > 0 else "positive"
    if value > 0:
        return "positive"
    if value < 0:
        return "negative"
    return "info"


def effect_tags(effects):
    labels = {
        "money": "Dinheiro",
        "reputation": "Reputação",
        "population": "População",
        "ageing": "Envelhecimento",
        "happiness": "Felicidade",
        "employment": "Emprego",
    }

    html = ""
    for key, label in labels.items():
        value = effects.get(key, 0)
        if value == 0:
            continue
        css = metric_class(key, value)
        sign = "+" if value > 0 else ""
        display = f"{sign}{money_text(value)}" if key == "money" else f"{sign}{value}"
        html += f'<span class="tag {css}">{label} {display}</span>'
    return html


def display_header():
    st.markdown('<div class="main-title">🏛️ Simulador Demográfico</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="subtitle">És o Chefe de Estado de Portugal. Cada decisão influencia a população, o orçamento, a reputação e o futuro do país.</div>',
        unsafe_allow_html=True,
    )


def display_stats():
    money_class = "negative" if st.session_state.money < 0 else "positive"
    ageing_class = "negative" if st.session_state.ageing > 70 else "warning"

    st.markdown(
        f"""
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value {money_class}">{money_text(st.session_state.money)}</div>
                <div class="stat-label">Dinheiro</div>
            </div>
            <div class="stat-card">
                <div class="stat-value info">{st.session_state.reputation}</div>
                <div class="stat-label">Reputação</div>
            </div>
            <div class="stat-card">
                <div class="stat-value positive">{st.session_state.population}</div>
                <div class="stat-label">População</div>
            </div>
            <div class="stat-card">
                <div class="stat-value {ageing_class}">{st.session_state.ageing}</div>
                <div class="stat-label">Envelhecimento</div>
            </div>
            <div class="stat-card">
                <div class="stat-value warning">{st.session_state.happiness}</div>
                <div class="stat-label">Felicidade</div>
            </div>
            <div class="stat-card">
                <div class="stat-value info">{st.session_state.employment}</div>
                <div class="stat-label">Emprego</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def display_progress():
    total = len(PHASES) + 2
    current = st.session_state.phase
    html = '<div class="progress-wrap">'
    for i in range(total):
        cls = "step"
        if i < current:
            cls += " done"
        elif i == current:
            cls += " active"
        html += f'<div class="{cls}"></div>'
    html += "</div>"
    st.markdown(html, unsafe_allow_html=True)


def story_card(icon, title, text, extra_class=""):
    st.markdown(
        f"""
        <div class="story-card {extra_class}">
            <span class="story-icon">{icon}</span>
            <div class="story-title">{title}</div>
            <div class="story-text">{text}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_choice(choice, index):
    st.markdown(
        f"""
        <div class="choice-card">
            <div class="choice-title">{choice['title']}</div>
            <div class="choice-desc">{choice['description']}</div>
            <div class="tag-row">{effect_tags(choice['effects'])}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if st.button("Escolher esta medida", key=f"choice_{st.session_state.phase}_{index}"):
        apply_effects(choice["effects"], choice["note"])


def render_phase():
    phase = PHASES[st.session_state.phase]
    story_card(phase["icon"], phase["title"], phase["text"])

    for i, choice in enumerate(phase["choices"]):
        render_choice(choice, i)


def render_random_event():
    if st.session_state.random_event is None:
        st.session_state.random_event = random.choice(RANDOM_EVENTS)

    event = st.session_state.random_event
    extra_class = {
        "good": "event-good",
        "bad": "event-bad",
        "neutral": "event-neutral",
    }.get(event["type"], "event-neutral")

    tags = effect_tags(event["effects"])
    story_card(
        event["icon"],
        event["title"],
        f"{event['text']}<br><br><div class='tag-row' style='justify-content:center;'>{tags}</div>",
        extra_class=extra_class,
    )

    if st.button("Aplicar consequências", key="apply_random_event"):
        selected = st.session_state.random_event
        st.session_state.random_event = None
        apply_effects(selected["effects"], selected["note"])


def final_result():
    score = (
        st.session_state.reputation
        + st.session_state.population
        + st.session_state.happiness
        + st.session_state.employment
        - st.session_state.ageing
    )

    if st.session_state.money < -15000:
        return {
            "icon": "💸",
            "title": "País Endividado",
            "text": "As medidas tiveram impacto, mas o país terminou com uma situação financeira muito frágil. A população pode ter melhorado em alguns pontos, mas o orçamento tornou-se um problema político grave.",
            "class": "negative",
        }
    if score >= 210:
        return {
            "icon": "🌟",
            "title": "Renascimento Demográfico",
            "text": "Portugal conseguiu atrair população, apoiar famílias, reter jovens e melhorar a confiança no futuro. O país termina mais equilibrado, produtivo e esperançoso.",
            "class": "positive",
        }
    if score >= 165:
        return {
            "icon": "⚖️",
            "title": "Estabilidade com Desafios",
            "text": "O país melhorou em várias áreas, mas ainda enfrenta problemas importantes. A população está relativamente estável, embora o envelhecimento continue a exigir atenção.",
            "class": "info",
        }
    if score >= 125:
        return {
            "icon": "⚠️",
            "title": "Futuro Incerto",
            "text": "Algumas medidas ajudaram, mas não foram suficientes para inverter a tendência demográfica. O país continua pressionado pelo envelhecimento e pela insatisfação social.",
            "class": "warning",
        }
    return {
        "icon": "📉",
        "title": "Crise Demográfica Grave",
        "text": "A população diminuiu, os jovens perderam confiança, o envelhecimento agravou-se e a reputação do governo caiu. Portugal termina o mandato numa situação difícil.",
        "class": "negative",
    }


def render_final():
    result = final_result()

    st.markdown(
        f"""
        <div class="story-card">
            <span class="story-icon">{result['icon']}</span>
            <div class="result-title {result['class']}">{result['title']}</div>
            <div class="story-text">{result['text']}</div>

            <div class="final-grid">
                <div class="final-box"><strong>{money_text(st.session_state.money)}</strong><span>Dinheiro final</span></div>
                <div class="final-box"><strong>{st.session_state.reputation}</strong><span>Reputação</span></div>
                <div class="final-box"><strong>{st.session_state.population}</strong><span>População</span></div>
                <div class="final-box"><strong>{st.session_state.ageing}</strong><span>Envelhecimento</span></div>
                <div class="final-box"><strong>{st.session_state.happiness}</strong><span>Felicidade</span></div>
                <div class="final-box"><strong>{st.session_state.employment}</strong><span>Emprego</span></div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown('<div class="timeline-title">Resumo do Mandato</div>', unsafe_allow_html=True)

    for item in st.session_state.history:
        st.markdown(f'<div class="timeline-item">{item}</div>', unsafe_allow_html=True)

    if st.button("Recomeçar jogo", key="restart_game"):
        init_game()
        st.rerun()


# =====================================================
# EXECUÇÃO PRINCIPAL
# =====================================================
if "phase" not in st.session_state:
    init_game()

display_header()
display_stats()
display_progress()

if st.session_state.phase < len(PHASES):
    render_phase()
elif st.session_state.phase == len(PHASES):
    render_random_event()
else:
    render_final()

st.markdown('<div class="footer-note">Jogo educativo sobre consequências de medidas demográficas.</div>', unsafe_allow_html=True)
