import amilLogo from '../assets/operator-logos/amil.png'
import assimSaudeLogo from '../assets/operator-logos/assim-saude.png'
import bradescoSaudeLogo from '../assets/operator-logos/bradesco-saude.png'
import kliniLogo from '../assets/operator-logos/klini.webp'
import leveSaudeLogo from '../assets/operator-logos/leve-saude.png'
import medSeniorLogo from '../assets/operator-logos/medsenior.png'
import portoSaudeLogo from '../assets/operator-logos/porto-saude.png'
import sulAmericaLogo from '../assets/operator-logos/sulamerica.png'

interface OperatorLogo {
  src: string
  imageClassName?: string
}

export const operatorLogos: Record<string, OperatorLogo> = {
  Amil: {
    src: amilLogo,
    imageClassName: 'max-h-7 max-w-[92px]',
  },
  'Assim Saúde': {
    src: assimSaudeLogo,
    imageClassName: 'max-h-7 max-w-[102px]',
  },
  'Bradesco Saúde': {
    src: bradescoSaudeLogo,
    imageClassName: 'max-h-8 max-w-[108px]',
  },
  SulAmérica: {
    src: sulAmericaLogo,
    imageClassName: 'max-h-7 max-w-[116px]',
  },
  'Porto Saúde': {
    src: portoSaudeLogo,
    imageClassName: 'max-h-7 max-w-[100px]',
  },
  MedSênior: {
    src: medSeniorLogo,
    imageClassName: 'max-h-7 max-w-[108px]',
  },
  'Leve Saúde': {
    src: leveSaudeLogo,
    imageClassName: 'max-h-8 max-w-[86px]',
  },
  Klini: {
    src: kliniLogo,
    imageClassName: 'max-h-8 max-w-[92px]',
  },
}
