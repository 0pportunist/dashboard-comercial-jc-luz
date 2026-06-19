import type { CSSProperties } from 'react'

interface BrandButtonPalette {
  background: string
  border: string
  text: string
  shadow: string
}

const fallbackPalette: BrandButtonPalette = {
  background: '#081B3D',
  border: 'transparent',
  text: '#FFFFFF',
  shadow: '0 10px 24px rgba(8, 27, 61, 0.18)',
}

const brandPalettes: Record<string, BrandButtonPalette> = {
  supermed: {
    background: '#111111',
    border: '#F4B321',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(17, 17, 17, 0.18)',
  },
  qualicorp: {
    background: '#002F5F',
    border: '#FCAF17',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(0, 47, 95, 0.2)',
  },
  allcare: {
    background: '#4B0F8F',
    border: '#FF5A76',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(75, 15, 143, 0.2)',
  },
  dixmed: {
    background: '#5B21B6',
    border: '#FEC514',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(91, 33, 182, 0.2)',
  },
  amil: {
    background: '#5B21B6',
    border: '#8B5CF6',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(91, 33, 182, 0.18)',
  },
  assim: {
    background: '#002B5C',
    border: '#38BDF8',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(0, 43, 92, 0.18)',
  },
  bradesco: {
    background: '#8F001B',
    border: '#EF4444',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(143, 0, 27, 0.18)',
  },
  sulamerica: {
    background: '#1D3B78',
    border: '#F97316',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(29, 59, 120, 0.18)',
  },
  porto: {
    background: '#003F7D',
    border: '#38BDF8',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(0, 63, 125, 0.18)',
  },
  medsenior: {
    background: '#006B3F',
    border: '#86EFAC',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(0, 107, 63, 0.18)',
  },
  leve: {
    background: '#006B3F',
    border: '#B7C72C',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(0, 107, 63, 0.18)',
  },
  klini: {
    background: '#081B3D',
    border: '#38BDF8',
    text: '#FFFFFF',
    shadow: '0 10px 24px rgba(8, 27, 61, 0.18)',
  },
}

function normalizeBrandName(brandName: string) {
  return brandName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '')
}

function getBrandPalette(brandName: string) {
  const normalized = normalizeBrandName(brandName)
  const key = Object.keys(brandPalettes).find((brandKey) => normalized.includes(brandKey))
  return key ? brandPalettes[key] : fallbackPalette
}

export function getBrandButtonStyle(brandName: string, isActive: boolean): CSSProperties | undefined {
  if (!isActive) return undefined

  const palette = getBrandPalette(brandName)

  return {
    backgroundColor: palette.background,
    borderColor: palette.border,
    color: palette.text,
    boxShadow: palette.shadow,
  }
}
