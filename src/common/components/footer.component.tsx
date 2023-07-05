'use client'
import NextLink from 'next/link'

import { Box, Button, Container, Flex, Text } from '@/common/design'

export default function Footer() {
  return (
    <Box bg='gray.50' color='gray.700' as='footer'>
      <Container maxW='5xl' py={4}>
        <Flex justify='space-between' align='center'>
          <Text as='small'>© 2023 chat-app</Text>
          <Box>
            <Button
              as={NextLink}
              fontSize='sm'
              fontWeight={600}
              color='black'
              variant='none'
              href='/setting/contact'
              _hover={{
                bg: 'gray.300',
              }}
            >
              お問い合わせ
            </Button>
            <Button
              as={NextLink}
              fontSize='sm'
              fontWeight={600}
              color='black'
              variant='none'
              href='/setting/terms'
              _hover={{
                bg: 'gray.300',
              }}
            >
              利用規約
            </Button>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
