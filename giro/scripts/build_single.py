"""Gera Giro.html: o app inteiro num único arquivo, para abrir direto no celular.

Uso (a partir da pasta giro/):  npm run build && python3 scripts/build_single.py
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def b64(path):
    return base64.b64encode((ROOT / path).read_bytes()).decode('ascii')


def script(path):
    js = read(path)
    # A literal closing tag or comment opener would end the inline <script> early.
    js = js.replace('</script', '<\\/script').replace('<!--', '<\\!--')
    return f'<script>/* {path} */\n{js}\n</script>'


def style(css, label):
    return f'<style>/* {label} */\n{css.replace("</style", "<\\/style")}\n</style>'


tokens = re.sub(
    r'url\("fonts/([^"]+)"\)',
    lambda m: f'url("data:font/woff2;base64,{b64("design-system/fonts/" + m.group(1))}")',
    read('design-system/tokens.css'),
)
icon = b64('design-system/icon-180.png') if (ROOT / 'design-system/icon-180.png').exists() else None
icon_tags = (
    f'<link rel="icon" type="image/png" href="data:image/png;base64,{icon}">\n'
    f'<link rel="apple-touch-icon" href="data:image/png;base64,{icon}">\n'
) if icon else ''

html = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#17181a" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Giro">
<meta name="format-detection" content="telephone=no">
<title>Giro</title>
<meta name="description" content="Alugue o carro de quem mora perto, por hora.">
{icon_tags}{style(read('vendor/leaflet.css'), 'vendor/leaflet.css')}
{style(tokens, 'design-system/tokens.css')}
{style(read('design-system/components.css'), 'design-system/components.css')}
{style(read('app.css'), 'app.css')}
</head>
<body>
<div id="app"></div>
<noscript>O Giro precisa de JavaScript para funcionar.</noscript>
{script('vendor/react.production.min.js')}
{script('vendor/react-dom.production.min.js')}
{script('vendor/leaflet.js')}
{script('design-system/giro.js')}
{script('dist/app.js')}
</body>
</html>
'''
out = ROOT / 'Giro.html'
out.write_text(html, encoding='utf-8')
print(f'{out.name}: {out.stat().st_size / 1024:.0f} KB')
