import allcareLogo from '../assets/administrator-logos/allcare.svg'
import qualicorpLogo from '../assets/administrator-logos/qualicorp.png'
import supermedLogo from '../assets/administrator-logos/supermed.webp'

interface AdministratorLogo {
  src: string
  imageClassName?: string
}

export const administratorLogos: Record<string, AdministratorLogo> = {
  Supermed: {
    src: supermedLogo,
    imageClassName: 'max-h-9 max-w-[150px]',
  },
  Qualicorp: {
    src: qualicorpLogo,
    imageClassName: 'max-h-9 max-w-[112px]',
  },
  Allcare: {
    src: allcareLogo,
    imageClassName: 'max-h-8 max-w-[116px]',
  },
}
