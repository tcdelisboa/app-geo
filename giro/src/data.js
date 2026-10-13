/* Dados de demonstração. Nenhum carro, pessoa ou valor aqui é real. */

export const CONFIG = {
  origin: { lat: -23.5665, lng: -46.6915 },
  feeRate: 0.10,            // taxa de serviço paga por quem aluga
  ownerCommission: 0.10,    // comissão descontada do repasse ao dono
  protection: {
    basica: { label: 'Proteção básica', perHour: 2.5, desc: 'Danos, roubo e terceiros. Franquia de R$ 2.000.' },
    completa: { label: 'Proteção completa', perHour: 5.5, desc: 'Tudo da básica, com franquia zero e carro reserva.' }
  },
  maxHours: 72
};

export const USER = {
  name: 'Marina Costa',
  short: 'Marina',
  email: 'marina@exemplo.com.br',
  phone: '(11) 9•••• 4821',
  card: 'Mastercard •••• 4821',
  memberSince: 'março de 2026',
  trips: 7,
  rating: 4.9
};

export const PLACES = [
  { id: 'pinheiros', name: 'Pinheiros', sub: 'São Paulo, SP', lat: -23.5665, lng: -46.6915 },
  { id: 'vilamadalena', name: 'Vila Madalena', sub: 'São Paulo, SP', lat: -23.5535, lng: -46.6905 },
  { id: 'paulista', name: 'Avenida Paulista', sub: 'Bela Vista, São Paulo', lat: -23.5614, lng: -46.6559 },
  { id: 'moema', name: 'Moema', sub: 'São Paulo, SP', lat: -23.6004, lng: -46.6624 },
  { id: 'itaim', name: 'Itaim Bibi', sub: 'São Paulo, SP', lat: -23.5843, lng: -46.6793 },
  { id: 'congonhas', name: 'Aeroporto de Congonhas', sub: 'Campo Belo, São Paulo', lat: -23.6267, lng: -46.6554 }
];

/* Carros de vizinhos. east/north: metros a partir da origem do mapa. */
export const CARS = [
  { id: 'hb20', model: 'Hyundai HB20', year: 2022, body: 'hatch', price: 18, dailyCap: 140, transmission: 'Manual', seats: 5, energy: 'Flex', rating: 4.9, trips: 32, color: '#c9ccd1', colorName: 'Prata', owner: 'Carla M.', ownerSince: '2025', ownerResp: '~10 min', pickup: 'Chave na portaria', street: 'Rua dos Pinheiros', east: -120, north: 300 },
  { id: 'mobi', model: 'Fiat Mobi', year: 2021, body: 'hatch', price: 12, dailyCap: 90, transmission: 'Manual', seats: 5, energy: 'Flex', rating: 4.8, trips: 41, color: '#f4f4f2', colorName: 'Branco', owner: 'Jorge A.', ownerSince: '2025', ownerResp: '~5 min', pickup: 'Entrega em mãos', street: 'Rua Cardeal Arcoverde', east: 380, north: -330 },
  { id: 'onix', model: 'Chevrolet Onix', year: 2023, body: 'sedan', price: 19, dailyCap: 150, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.8, trips: 56, color: '#2b2d31', colorName: 'Preto', owner: 'Patrícia L.', ownerSince: '2024', ownerResp: '~15 min', pickup: 'Chave na portaria', street: 'Rua Teodoro Sampaio', east: -540, north: -260 },
  { id: 'kwid', model: 'Renault Kwid', year: 2022, body: 'hatch', price: 13, dailyCap: 95, transmission: 'Manual', seats: 5, energy: 'Flex', rating: 4.7, trips: 18, color: '#d8792b', colorName: 'Laranja', owner: 'Bruno T.', ownerSince: '2025', ownerResp: '~20 min', pickup: 'Entrega em mãos', street: 'Rua Fradique Coutinho', east: 560, north: 520 },
  { id: 'polo', model: 'Volkswagen Polo', year: 2023, body: 'hatch', price: 21, dailyCap: 160, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 5.0, trips: 12, color: '#c9ccd1', colorName: 'Prata', owner: 'Ana P.', ownerSince: '2026', ownerResp: '~10 min', pickup: 'Cofre de chave', street: 'Rua Artur de Azevedo', east: -860, north: 180 },
  { id: 'dolphin', model: 'BYD Dolphin', year: 2024, body: 'hatch', price: 29, dailyCap: 220, transmission: 'Automático', seats: 5, energy: 'Elétrico', range: '290 km de autonomia', rating: 4.9, trips: 27, color: '#3d6e8f', colorName: 'Azul', owner: 'Rafael S.', ownerSince: '2024', ownerResp: '~5 min', pickup: 'Cofre de chave', street: 'Rua Mourato Coelho', east: 1050, north: 40 },
  { id: 'tcross', model: 'Volkswagen T-Cross', year: 2022, body: 'suv', price: 26, dailyCap: 200, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.9, trips: 38, color: '#f4f4f2', colorName: 'Branco', owner: 'Luiza F.', ownerSince: '2024', ownerResp: '~10 min', pickup: 'Chave na portaria', street: 'Rua Butantã', east: 260, north: -1180 },
  { id: 'pulse', model: 'Fiat Pulse', year: 2023, body: 'suv', price: 22, dailyCap: 170, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.6, trips: 9, color: '#a33a2a', colorName: 'Vermelho', owner: 'Diego R.', ownerSince: '2026', ownerResp: '~30 min', pickup: 'Entrega em mãos', street: 'Rua Capote Valente', east: -700, north: 1080, unavailable: true },
  { id: 'corolla', model: 'Toyota Corolla', year: 2022, body: 'sedan', price: 32, dailyCap: 240, transmission: 'Automático', seats: 5, energy: 'Híbrido', rating: 4.9, trips: 64, color: '#2b2d31', colorName: 'Preto', owner: 'Marcos V.', ownerSince: '2023', ownerResp: '~5 min', pickup: 'Chave na portaria', street: 'Avenida Pedroso de Morais', east: 1300, north: -620 },
  { id: 'renegade', model: 'Jeep Renegade', year: 2021, body: 'suv', price: 27, dailyCap: 210, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.7, trips: 22, color: '#6b6f55', colorName: 'Verde-oliva', owner: 'Helena C.', ownerSince: '2025', ownerResp: '~20 min', pickup: 'Entrega em mãos', street: 'Rua Lisboa', east: -1500, north: -500, unavailable: true },
  { id: 'kwide', model: 'Renault Kwid E-Tech', year: 2023, body: 'hatch', price: 24, dailyCap: 180, transmission: 'Automático', seats: 4, energy: 'Elétrico', range: '180 km de autonomia', rating: 4.8, trips: 11, color: '#e9e9e4', colorName: 'Branco', owner: 'Tiago N.', ownerSince: '2025', ownerResp: '~10 min', pickup: 'Cofre de chave', street: 'Rua Simão Álvares', east: 480, north: 1800 },
  { id: 'hrv', model: 'Honda HR-V', year: 2023, body: 'suv', price: 34, dailyCap: 260, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.8, trips: 15, color: '#8d9096', colorName: 'Cinza', owner: 'Sofia B.', ownerSince: '2024', ownerResp: '~15 min', pickup: 'Chave na portaria', street: 'Rua Joaquim Antunes', east: 1850, north: 950 }
];

export const REVIEWS = [
  { name: 'Felipe R.', when: 'setembro de 2026', stars: 5, text: 'Carro limpo, chave na portaria como combinado. Peguei e devolvi sem falar com ninguém.' },
  { name: 'Juliana K.', when: 'agosto de 2026', stars: 5, text: 'Precisei por 3 horas para uma mudança pequena. Saiu bem mais barato que um app de corrida.' },
  { name: 'André M.', when: 'agosto de 2026', stars: 4, text: 'Tudo certo. Só o tanque estava um pouco abaixo do indicado, mas a dona resolveu na hora.' }
];

export const RULES = [
  'Devolva com o mesmo nível de combustível ou carga',
  'Proibido fumar e transportar animais sem caixa',
  'Atraso na devolução: R$ 15 a cada 15 min',
  'Cancelamento grátis até 2 h antes da retirada'
];

/* O carro que a Marina já anuncia (lado do anfitrião). */
export const MY_CAR = {
  id: 'meu-creta', model: 'Hyundai Creta', year: 2022, body: 'suv', price: 25, dailyCap: 190, transmission: 'Automático', seats: 5, energy: 'Flex',
  rating: 4.9, trips: 23, color: '#4a5560', colorName: 'Grafite', owner: 'Marina C.', ownerSince: '2026', ownerResp: '~10 min', pickup: 'Cofre de chave', street: 'Rua Ferreira de Araújo',
  east: -260, north: -720, mine: true, active: true
};

/* Ganhos brutos por semana (últimas 8), em reais. */
export const EARNINGS_WEEKS = [182, 240, 196, 318, 274, 352, 298, 410];

export const OWNER_UPCOMING = [
  { who: 'Rodrigo P.', rating: 4.9, day: 0, start: 18, hours: 3 },
  { who: 'Beatriz S.', rating: 5.0, day: 1, start: 9, hours: 6 },
  { who: 'Caio M.', rating: 4.8, day: 3, start: 14, hours: 24 }
];

export const PAST_TRIPS = [
  { id: 'GR-8K2P', carId: 'polo', daysAgo: 9, startHour: 10, hours: 5, total: 132.55, rated: 5 },
  { id: 'GR-3M7Q', carId: 'mobi', daysAgo: 23, startHour: 19, hours: 3, total: 47.85, rated: 5 }
];

export const MODELS = [
  { model: 'Chevrolet Onix', body: 'sedan', suggest: [17, 21] },
  { model: 'Fiat Argo', body: 'hatch', suggest: [15, 19] },
  { model: 'Fiat Mobi', body: 'hatch', suggest: [11, 14] },
  { model: 'Honda Civic', body: 'sedan', suggest: [26, 32] },
  { model: 'Hyundai HB20', body: 'hatch', suggest: [16, 20] },
  { model: 'Jeep Compass', body: 'suv', suggest: [30, 38] },
  { model: 'Renault Kwid', body: 'hatch', suggest: [12, 15] },
  { model: 'Toyota Corolla', body: 'sedan', suggest: [28, 34] },
  { model: 'Toyota Yaris', body: 'hatch', suggest: [18, 22] },
  { model: 'Volkswagen Gol', body: 'hatch', suggest: [13, 16] },
  { model: 'Volkswagen Nivus', body: 'suv', suggest: [23, 28] },
  { model: 'Volkswagen T-Cross', body: 'suv', suggest: [24, 29] }
];

export const COLORS = [
  { name: 'Branco', hex: '#f4f4f2' },
  { name: 'Prata', hex: '#c9ccd1' },
  { name: 'Cinza', hex: '#8d9096' },
  { name: 'Preto', hex: '#2b2d31' },
  { name: 'Vermelho', hex: '#a33a2a' },
  { name: 'Azul', hex: '#3d6e8f' }
];
