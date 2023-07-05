'use client'
import { Container } from '@/common/design'

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <Container
      as='main'
      maxW='container.lg'
      my='2'
      minH='calc(100vh - 115px - 2rem)'
    >
      {children}
    </Container>
  )
}
