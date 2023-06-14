'use client'

import NextLink from 'next/link'

import { Button } from '@/app/common/design'

export const TransitionButton = (args: {
  bgColor: string
  hoverColor: string
  fontColor: string
  href: string
  btnText: string
}) => {
  return (
    <Button
      as={NextLink}
      fontSize='sm'
      fontWeight={600}
      color={args.fontColor}
      bg={args.bgColor}
      href={args.href}
      _hover={{
        bg: args.hoverColor,
      }}
    >
      {args.btnText}
    </Button>
  )
}
