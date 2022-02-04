import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, LinkExternal, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface IfoCardDetailsProps {
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  raisingAmount: BigNumber
  totalAmount: BigNumber
  endDate: string
  endTime: string
  releaseBlockNumber: number
}

const StyledIfoCardDetails = styled.div`
  margin-bottom: 24px;
`

const Item = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
`

const Display = styled(Text)`
  flex: 1;
`

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({
  launchDate,
  launchTime,
  saleAmount,
  raiseAmount,
  cakeToBurn,
  projectSiteUrl,
  raisingAmount,
  totalAmount,
  endDate,
  endTime,
  releaseBlockNumber
}) => {
  const TranslateString = useI18n()

  return (
    <>
      <StyledIfoCardDetails>
        <Item>
          <Display>End Time</Display>
          <Text>
            {endDate},
            {endTime}
          </Text>
        </Item>
        <Item>
          <Display>Claim Block</Display>
          <Text>
              {releaseBlockNumber}
          </Text>
        </Item>
        <Item>
          <Display>{TranslateString(584, 'For Sale')}</Display>
          <Text>{saleAmount}</Text>
        </Item>
        <Item>
          <Display>To raise</Display>
          <Text>{raiseAmount}</Text>
        </Item>
        <Item style={cakeToBurn === '0' ? {display : 'none'} : {display : 'flex'}}>
          <Display>{TranslateString(586, 'CAKE to burn (USD)')}</Display>
          <Text>{cakeToBurn}</Text>
        </Item>
        <Item>
          <Display>{TranslateString(999, 'Total raised (% of target)')}</Display>
          <Text>{`${totalAmount.div(raisingAmount).times(100).toFixed(2)}%`}</Text>
        </Item>
      </StyledIfoCardDetails>
      <LinkExternal href={projectSiteUrl} style={{ margin: 'auto' }}>
        {TranslateString(412, 'View project site')}
      </LinkExternal>
    </>
  )
}

export default IfoCardDetails
