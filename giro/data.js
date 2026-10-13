/* Giro — dados fictícios do protótipo.
   Cada carro fica a `east`/`north` metros do ponto de origem (Pinheiros, ou a sua
   localização quando você toca em "Centralizar"). Troque por uma API quando houver backend. */
window.GIRO_CONFIG = {
  origin: { lat: -23.5665, lng: -46.6915 },
  place: 'Pinheiros, São Paulo',
  startHour: 14,          /* busca de exemplo: hoje a partir das 14:00 */
  defaultHours: 4,
  maxHours: 24,
  feeRate: 0.10,          /* taxa de serviço cobrada de quem aluga */
  ownerCommission: 0.10,  /* comissão descontada do repasse ao dono (não aparece para quem aluga) */
  protectionPerHour: 2.5  /* proteção básica, R$ por hora */
};

window.GIRO_CARS = [
  { id: 'hb20', model: 'Hyundai HB20', year: 2022, price: 18, dailyCap: 140, transmission: 'Manual', seats: 5, energy: 'Flex', rating: 4.9, trips: 32, color: '#c9ccd1', colorName: 'Prata', owner: 'Carla M.', pickup: 'Chave na portaria', east: -120, north: 300 },
  { id: 'mobi', model: 'Fiat Mobi', year: 2021, price: 12, dailyCap: 90, transmission: 'Manual', seats: 5, energy: 'Flex', rating: 4.8, trips: 41, color: '#f4f4f2', colorName: 'Branco', owner: 'Jorge A.', pickup: 'Entrega em mãos', east: 380, north: -330 },
  { id: 'onix', model: 'Chevrolet Onix', year: 2023, price: 19, dailyCap: 150, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.8, trips: 56, color: '#2b2d31', colorName: 'Preto', owner: 'Patrícia L.', pickup: 'Chave na portaria', east: -540, north: -260 },
  { id: 'kwid', model: 'Renault Kwid', year: 2022, price: 13, dailyCap: 95, transmission: 'Manual', seats: 5, energy: 'Flex', rating: 4.7, trips: 18, color: '#d8792b', colorName: 'Laranja', owner: 'Bruno T.', pickup: 'Entrega em mãos', east: 560, north: 520 },
  { id: 'polo', model: 'Volkswagen Polo', year: 2023, price: 21, dailyCap: 160, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 5.0, trips: 12, color: '#c9ccd1', colorName: 'Prata', owner: 'Ana P.', pickup: 'Cofre de chave', east: -860, north: 180 },
  { id: 'dolphin', model: 'BYD Dolphin', year: 2024, price: 29, dailyCap: 220, transmission: 'Automático', seats: 5, energy: 'Elétrico', rating: 4.9, trips: 27, color: '#3d6e8f', colorName: 'Azul', owner: 'Rafael S.', pickup: 'Cofre de chave', east: 1050, north: 40 },
  { id: 'tcross', model: 'Volkswagen T-Cross', year: 2022, price: 26, dailyCap: 200, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.9, trips: 38, color: '#f4f4f2', colorName: 'Branco', owner: 'Luiza F.', pickup: 'Chave na portaria', east: 260, north: -1180 },
  { id: 'pulse', model: 'Fiat Pulse', year: 2023, price: 22, dailyCap: 170, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.6, trips: 9, color: '#a33a2a', colorName: 'Vermelho', owner: 'Diego R.', pickup: 'Entrega em mãos', east: -700, north: 1080, unavailable: true },
  { id: 'corolla', model: 'Toyota Corolla', year: 2022, price: 32, dailyCap: 240, transmission: 'Automático', seats: 5, energy: 'Híbrido', rating: 4.9, trips: 64, color: '#2b2d31', colorName: 'Preto', owner: 'Marcos V.', pickup: 'Chave na portaria', east: 1300, north: -620 },
  { id: 'renegade', model: 'Jeep Renegade', year: 2021, price: 27, dailyCap: 210, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.7, trips: 22, color: '#6b6f55', colorName: 'Verde-oliva', owner: 'Helena C.', pickup: 'Entrega em mãos', east: -1500, north: -500, unavailable: true },
  { id: 'kwide', model: 'Renault Kwid E-Tech', year: 2023, price: 24, dailyCap: 180, transmission: 'Automático', seats: 4, energy: 'Elétrico', rating: 4.8, trips: 11, color: '#e9e9e4', colorName: 'Branco', owner: 'Tiago N.', pickup: 'Cofre de chave', east: 480, north: 1800 },
  { id: 'hrv', model: 'Honda HR-V', year: 2023, price: 34, dailyCap: 260, transmission: 'Automático', seats: 5, energy: 'Flex', rating: 4.8, trips: 15, color: '#8d9096', colorName: 'Cinza', owner: 'Sofia B.', pickup: 'Chave na portaria', east: 1850, north: 950 }
];
