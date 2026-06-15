import blueHorizontal from '../assets/brand/jc-luz-blue-horizontal.png'
import blueVertical from '../assets/brand/jc-luz-blue-vertical.png'
import whiteHorizontal from '../assets/brand/jc-luz-white-horizontal.png'
import whiteVertical from '../assets/brand/jc-luz-white-vertical.png'

interface BrandLogoProps {
  color?: 'blue' | 'white'
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const brandLogos = {
  blue: {
    horizontal: blueHorizontal,
    vertical: blueVertical,
  },
  white: {
    horizontal: whiteHorizontal,
    vertical: whiteVertical,
  },
}

export function BrandLogo({
  color = 'blue',
  orientation = 'horizontal',
  className = '',
}: BrandLogoProps) {
  return (
    <img
      src={brandLogos[color][orientation]}
      alt="JC Luz Corretora de Seguros"
      className={`h-auto object-contain ${className}`}
    />
  )
}
