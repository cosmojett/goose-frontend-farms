import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/api'
import { useTotalValue, usePriceCakeBusd } from '../../../state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  background-image: url('/images/price-hero.png');
  background-repeat: no-repeat;
  background-position: right;

`

const TotalValueLockedCard = (props) => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  const totalValue = useTotalValue();
  const price = usePriceCakeBusd()
  // const tvl = totalValue.toFixed(2);

  return (
    <StyledTotalValueLockedCard {...props}>
      <CardBody>
        <Heading size="xl" mb="24px">
          BUZZ Price
        </Heading>
        <>
          {/* <Heading size="xl">{`$${tvl}`}</Heading> */}
          {/* <Heading size="xl"> */}
            <CardValue value={price.toNumber()} prefix="$" decimals={6}/>
          {/* </Heading> */}
        </>
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
