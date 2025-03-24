import { FlexProps, Image, ImageProps, useColorMode } from '@chakra-ui/react'

export const Logo = (props: FlexProps) => {
  const { colorMode } = useColorMode()
  const logoSrc = colorMode === 'dark' ? '/img/onboarding/supcharge.png' : '/img/onboarding/supcharge.png'
  return <Image src={logoSrc} alt="SuperCharge AI" width="160px" {...props} style={{width: '300px'}} />
}

export const LogoIcon = (props: ImageProps) => {
  const { colorMode } = useColorMode()
  const logoSrc = colorMode === 'dark' ? '/img/onboarding/supcharge.png' : '/img/onboarding/supcharge.png'
  return <Image src={logoSrc} alt="SuperCharge AI" {...props} style={{width: '300px'}} />
}
