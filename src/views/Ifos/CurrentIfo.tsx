import React from 'react'
import styled from 'styled-components'
import { Text, Heading, BaseLayout, Button, LinkExternal, Flex, Image } from '@pancakeswap-libs/uikit'
import Container from 'components/layout/Container'
import { ifosConfig } from 'config/constants'
import useI18n from 'hooks/useI18n'
import IfoCard from './components/IfoCard'
import Title from './components/Title'
import IfoCards from './components/IfoCards'

const LaunchIfoCallout = styled(BaseLayout)`
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  margin: 0 auto;
  padding: 32px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

const List = styled.ul`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;

  & > li {
    line-height: 1.4;
    margin-bottom: 8px;
  }
`

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  const TranslateString = useI18n()

  return (
    <div>
      <IfoCards isSingle>
        <IfoCard ifo={activeIfo} />
      </IfoCards>
      <LaunchIfoCallout>
        <div>
          <Title as="h2">{TranslateString(592, 'How to take part')}</Title>
          <Heading mb="16px">{TranslateString(594, 'Before Sale')}:</Heading>
          <List>
            <li>Buy commit tokens</li>
            <li>Unstake your commit tokens and ready for participation</li>
          </List>
          <Flex mb="16px">
            <LinkExternal href="https://exchange.pancakeswap.finance/#/swap" mr="16px">
              Buy BUZZ
            </LinkExternal>
          </Flex>
          <Heading mb="16px">{TranslateString(600, 'During Sale')}:</Heading>
          <List>
            <li>While the sale is live, commit your tokens to buy the IFO tokens</li>
          </List>
          <Heading mb="16px">{TranslateString(604, 'After Sale')}:</Heading>
          <List>
            <li>Claim the tokens you bought, along with any unspent funds.</li>
            <li>Done</li>
          </List>
        </div>
        <div>
          <div>
            <Title as="h2">Want to lift-off your project?</Title>
            <Text mb={3}>
              Launch your project with Cosmosium Finance, raise your target amount easily with the strong community of Cosmosium Alliance.
            </Text>
            <Button
              as="a"
              href="#"
              external
            >
              Application Will be Available
            </Button>
          </div>
        </div>
      </LaunchIfoCallout>
    </div>
  )
}

export default Ifo
