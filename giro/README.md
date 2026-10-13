# Giro: protótipo navegável

Aluguel de carros entre vizinhos, cobrado por hora. Este protótipo simula o app funcionando de ponta a ponta, para demonstrações e conversas com investidores. Todos os carros, pessoas e valores são fictícios e nenhum pagamento é cobrado.

## Como abrir no celular

Mande o arquivo **`Giro.html`** para o celular (WhatsApp, e-mail, Drive ou AirDrop) e abra no navegador. É um arquivo único, de cerca de 500 KB, com o app inteiro dentro: funciona até sem internet, e nesse caso usa o mapa desenhado.

- **iPhone:** salve em Arquivos e toque nele, ou abra pelo Safari.
- **Android:** abra o download com o Chrome.

Para gerar de novo depois de mudar o código: `npm run single`.

## Como abrir no computador

Site estático, sem nada para instalar:

```bash
cd giro
python3 -m http.server 8000
# abra http://localhost:8000
```

Também funciona abrindo `giro/index.html` direto no navegador. No computador, o app aparece numa moldura de celular com um resumo ao lado. No celular, ocupa a tela inteira.

O mapa usa ruas reais do OpenStreetMap/CARTO e precisa de internet. Sem acesso a esse servidor, o app troca sozinho para o mapa desenhado do design system.

## Roteiro de demonstração (5 minutos)

1. **Boas-vindas.** Duas portas de entrada: “Quero alugar um carro” e “Quero ganhar com meu carro”.
2. **Explorar.** Mapa com o preço por hora de cada carro. Filtre por preço, câmbio, elétrico, SUV ou nota. Toque num pin para ver o resumo.
3. **Busca.** Toque na barra do topo para trocar o bairro (Vila Madalena, Paulista, Congonhas…), o dia, a hora e a duração.
4. **Carro.** Ficha completa: anfitrião verificado, retirada da chave, avaliações, regras e diária máxima.
5. **Pagamento.** Escolha a proteção, pague com Pix (QR de demonstração; aprova sozinho em alguns segundos ou em “Já paguei”) ou cartão.
6. **Reserva.** Confirmação com código, chat com o anfitrião, vistoria com fotos e nível do tanque, contagem regressiva da viagem, destrancar o carro e avaliar na devolução.
7. **Meus carros.** Lado de quem anuncia: ganhos das últimas semanas, próximas reservas, pausar um anúncio e editar o preço.
8. **Anunciar.** Cadastro em 4 passos (modelo e placa, fotos, preço sugerido para a região, retirada e dias). Ao publicar, o carro aparece no mapa na hora.

Para recomeçar do zero: Perfil → Reiniciar demonstração.

## Modelo de receita (configurável em `src/data.js`)

| Item | Quem paga | Valor de exemplo |
| --- | --- | --- |
| Taxa de serviço | quem aluga | 10% do aluguel + proteção |
| Comissão | quem anuncia | 10% do aluguel |
| Proteção básica | quem aluga | R$ 2,50/h (repassada à seguradora parceira) |
| Proteção completa | quem aluga | R$ 5,50/h |

Preço definido pelo dono, por hora, com diária máxima: depois de algumas horas no mesmo dia, quem aluga paga só a diária.

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | Página |
| `src/` | Código-fonte (React + JSX), uma tela por arquivo |
| `dist/app.js` | Build pronto de `src/` (gerado, versionado para abrir sem instalar nada) |
| `app.css` | Layout e estilos das telas |
| `design-system/` | Tokens, componentes (`window.Giro`) e fonte do design system Giro |
| `vendor/` | React 18.3.1 e Leaflet 1.9.4 |

Para alterar o código: `npm install` e depois `npm run build` (ou `npm run watch`).

## O que falta para virar produto

1. Backend: contas, verificação de CNH e identidade, anúncios, calendário e reservas.
2. Pagamentos reais (Pix e cartão) com pré-autorização, split e repasse semanal ao dono.
3. Seguro por reserva com uma seguradora parceira.
4. Vistoria com fotos reais e, depois, chave digital (telemetria) para retirada sem encontro.
5. Apps nativos (iOS e Android) a partir destas telas e do design system.
