# Giro: protótipo da tela Explorar

Aluguel de carros entre pessoas, cobrado por hora. Esta é a primeira fase: o **mapa com os carros disponíveis** perto de você, com lista, filtros, detalhe do carro e cálculo do preço.

## Como abrir

É um site estático, sem build e sem dependências para instalar.

- Mais simples: abra `giro/index.html` no navegador.
- Ou sirva a pasta (recomendado para testar a geolocalização, que exige `localhost` ou HTTPS):

```bash
cd giro
python3 -m http.server 8000
# abra http://localhost:8000
```

O mapa usa blocos do OpenStreetMap/CARTO, então precisa de internet. O resto (React, Leaflet, fonte) está em `vendor/` e `design-system/`.

## O que dá para fazer

- Ver os carros como **pins de preço por hora** no mapa. Os indisponíveis no horário aparecem esmaecidos.
- Filtrar por preço, câmbio automático, elétrico e nota.
- Tocar num pin ou numa linha da lista para ver o detalhe: dono, entrega da chave, duração (1 a 24 h) e a quebra do preço (aluguel, proteção, taxa de serviço e total).
- “Centralizar”: usa a sua localização. Longe de São Paulo, os carros de exemplo são reposicionados à sua volta.
- No celular, painel inferior (espiada, lista aberta, detalhe). No desktop (≥ 900px), painel lateral.
- Tema claro e escuro automáticos. Esc fecha o detalhe.

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `index.html` | Página |
| `app.js` | Tela Explorar (React + Leaflet) |
| `app.css` | Layout da tela (celular e desktop) |
| `data.js` | Configuração (taxas, horário da busca) e os 12 carros fictícios |
| `design-system/` | Tokens, componentes (`window.Giro`) e fonte do design system Giro |
| `vendor/` | React 18.3.1 e Leaflet 1.9.4 |

## Regras de preço (em `data.js`)

- Preço por hora definido pelo dono, com **diária máxima** (`dailyCap`). Acima dela, as horas extras do dia não são cobradas.
- `protectionPerHour`: proteção básica cobrada por hora (exemplo: R$ 2,50).
- `feeRate`: taxa de serviço paga por quem aluga (exemplo: 10%).
- `ownerCommission`: comissão descontada do repasse ao dono (exemplo: 10%). Ainda não aparece nesta tela.

## Próximos passos

1. Backend com cadastro e verificação de CNH, anúncios de carros e calendário de disponibilidade.
2. Busca de endereço e escolha de data e hora.
3. Pagamento (Pix e cartão) com pré-autorização e repasse ao dono.
4. Seguro por reserva com uma seguradora parceira.
5. Fluxo de retirada e devolução com fotos do carro (vistoria) e check-in.
6. Lado de quem anuncia: cadastro do carro, fotos, preço por hora, diária máxima e ganhos.
