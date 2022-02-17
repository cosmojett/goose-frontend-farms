import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance, useChefBalance, useTreasuryBalance,  useAddressBalance } from 'hooks/useTokenBalance'
import { useCosmicBalance } from 'hooks/useFarmsWithBalance'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import { useFarms, useTotalValue, usePriceCakeBusd } from '../../../state/hooks'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = (props) => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const autoFarmStakes = useCosmicBalance('0x79eFe3cC2E2291D9570762d0a6b8Cf00B9d593df')
  const chefBalance = useChefBalance(getCakeAddress()).minus(autoFarmStakes)
  const treasuryBalance = useTreasuryBalance(getCakeAddress(),'0xAd8F748b2e87bDDCbf98f11a63F9f3CbcDD34B38')
  const apeBalance = useTreasuryBalance(getCakeAddress(),'0x907cEc57456ADb5484921771d692a74c2Dd0d107')
  const farms = useFarms();
  const eggPrice = usePriceCakeBusd();
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance).minus(chefBalance).minus(treasuryBalance).minus(apeBalance) : new BigNumber(0);
  const cakeSupply = getBalanceNumber(circSupply);
  const marketCap = eggPrice.times(circSupply);

  const totalValue = useTotalValue();
  const cluster1 = useAddressBalance('0xa73c15620bfa79646e9a11d0d638d66588456462','0x1770104aa9b1BDB1D1582802b3221a466A2A4f4d').dividedBy(new BigNumber(10).pow(18)).times(eggPrice)
  const cluster2 = useAddressBalance('0xa73c15620bfa79646e9a11d0d638d66588456462','0x027c055560F176A60206B592583927a4DE913FEF').dividedBy(new BigNumber(10).pow(18)).times(eggPrice)
  const cosmicBalance = useCosmicBalance('0x79eFe3cC2E2291D9570762d0a6b8Cf00B9d593df').dividedBy(new BigNumber(10).pow(18)).times(eggPrice)
  const tvl = cosmicBalance.plus(cluster2).plus(cluster1).plus(totalValue).times(1.865)

  let buzzPerBlock = 0;
  if(farms && farms[0] && farms[0].buzzPerBlock){
    buzzPerBlock = new BigNumber(farms[0].buzzPerBlock).div(new BigNumber(10).pow(18)).toNumber();
  }

  return (
    <StyledCakeStats {...props}>
      <CardBody>
        <Heading size="lg" mb="24px">
          {TranslateString(534, 'Egg Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{TranslateString(10005, 'Market Cap')}</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(marketCap)} decimals={0} prefix="$" />
        </Row>
        <Row>
          <Text fontSize="14px">Total Value Staked</Text>
          <CardValue fontSize="14px" value={tvl.toNumber()} decimals={0} prefix="$" />
        </Row>
        <Row>
          <Text fontSize="14px">Total Burnt</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} decimals={0} />
        </Row>
        <Row>
          <Text fontSize="14px">Uncirculated Buzz</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(chefBalance)} decimals={0} />
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(10004, 'Circulating Supply')}</Text>
          {cakeSupply && <CardValue fontSize="14px" value={cakeSupply} decimals={0} />}
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(540, 'New EGG/block')}</Text>
          <Text bold fontSize="14px">{buzzPerBlock}</Text>
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
