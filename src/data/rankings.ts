import type { RankingEntry } from '../types'

export const brokerRankings: RankingEntry[] = [
  { position: 1, name: 'Maycon Moreira Rodrigues Louvain', team: 'Equipe Forjados', sales: 14, lives: 148, value: 42546.69, campaign: 'Produção Maio/2026', productionShare: 5.09 },
  { position: 2, name: 'Danielle Simões Santiago', team: 'Equipe Os Incríveis', sales: 23, lives: 47, value: 28907.83, campaign: 'Produção Maio/2026', productionShare: 3.46 },
  { position: 3, name: 'Sueli Verdan dos Santos', team: 'Equipe Imbatível', sales: 5, lives: 66, value: 23096.66, campaign: 'Produção Maio/2026', productionShare: 2.77 },
  { position: 4, name: 'Antonio Carlos Conceição Guimarães', team: 'Equipe McLaren', sales: 11, lives: 37, value: 19598.95, campaign: 'Produção Maio/2026', productionShare: 2.35 },
  { position: 5, name: 'Katia Simone Gomes de Oliveira', team: 'Equipe Águia', sales: 9, lives: 9, value: 18636.50, campaign: 'Produção Maio/2026', productionShare: 2.23 },
  { position: 6, name: 'Iracema Leoncio da Silva', team: 'Equipe Ouro', sales: 4, lives: 18, value: 13197.40, campaign: 'Produção Maio/2026', productionShare: 1.58 },
  { position: 7, name: 'José Geraldo de Lima', team: 'Equipe Diamantes', sales: 7, lives: 216, value: 12982.15, campaign: 'Produção Maio/2026', productionShare: 1.55 },
  { position: 8, name: 'Rayane de Lira Costa Delduque', team: 'Equipe Ouro', sales: 18, lives: 42, value: 12484.24, campaign: 'Produção Maio/2026', productionShare: 1.49 },
  { position: 9, name: 'Sunamita dos Anjos Nogueira', team: 'Equipe Gigantes', sales: 8, lives: 33, value: 12448.76, campaign: 'Produção Maio/2026', productionShare: 1.49 },
  { position: 10, name: 'Luiz Carlos Souza Silva', team: 'Equipe Alpha', sales: 13, lives: 36, value: 12415.23, campaign: 'Produção Maio/2026', productionShare: 1.49 },
]

export const supervisorRankings: RankingEntry[] = [
  { position: 1, name: 'Altair de Oliveira da Silva', team: 'Equipe Premium', sales: 180, lives: 442, value: 189371.85, campaign: 'Produção Maio/2026', productionShare: 15.35 },
  { position: 2, name: 'Ian Keyllon', team: 'Equipe Imbatível', sales: 132, lives: 358, value: 143072.01, campaign: 'Produção Maio/2026', productionShare: 11.60 },
  { position: 3, name: 'Helen Câmara', team: 'Equipe McLaren', sales: 140, lives: 563, value: 118235.82, campaign: 'Produção Maio/2026', productionShare: 9.58 },
  { position: 4, name: 'Bruno Chaves da Rocha', team: 'Equipe Os Incríveis', sales: 136, lives: 282, value: 117819.39, campaign: 'Produção Maio/2026', productionShare: 9.55 },
  { position: 5, name: 'Esmeralda Albuquerque', team: 'Equipe Ouro', sales: 104, lives: 226, value: 104814.20, campaign: 'Produção Maio/2026', productionShare: 8.50 },
  { position: 6, name: 'Rafael Azeredo', team: 'Equipe Perfil', sales: 111, lives: 245, value: 93886.92, campaign: 'Produção Maio/2026', productionShare: 7.61 },
  { position: 7, name: 'Fabiano Cruz', team: 'Equipe Águia', sales: 105, lives: 201, value: 81738.63, campaign: 'Produção Maio/2026', productionShare: 6.63 },
  { position: 8, name: 'Jaqueline Mesquita', team: 'Equipe Forjados', sales: 59, lives: 241, value: 74353.25, campaign: 'Produção Maio/2026', productionShare: 6.03 },
  { position: 9, name: 'Luciana Adão', team: 'Equipe Elite', sales: 102, lives: 212, value: 71662.33, campaign: 'Produção Maio/2026', productionShare: 5.81 },
  { position: 10, name: 'Viviane Pinheiro', team: 'Equipe Diamantes', sales: 114, lives: 6239, value: 65733.00, campaign: 'Produção Maio/2026', productionShare: 5.33 },
]

export const productionReport = {
  period: '01 a 30 de maio de 2026',
  issuedAt: '08 de junho de 2026',
  brokerBase: {
    label: 'CLT e Salão',
    value: 835190.48,
    contracts: 1045,
    lives: 8899,
  },
  supervisorBase: {
    label: 'Todas as equipes',
    value: 1233799.90,
    contracts: 1440,
    lives: 9799,
  },
}
