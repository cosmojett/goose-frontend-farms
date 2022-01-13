import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  max-width : 90%;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;

  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
      margin-right : 240px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-top: 32px;
    padding-bottom: 32px;
      margin-right : 240px;
  }
`

export default Page
