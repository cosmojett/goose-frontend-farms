import React, { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import getTimePeriods from 'utils/getTimePeriods'
import formatTimePeriod from 'utils/formatTimePeriod'
import { useCluster } from 'hooks/useContract'
import { autoFarmTotal, autoFarmDepositFee, clusterLock } from 'utils/callHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface AutoFarmWithStakedValue extends Farm {
  apy?: BigNumber
  yearlyDist?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const Background = styled.div`
  position : absolute;
  height : 100%;
  width : 100%;
  opacity : 0.5;
  border-radius: 8px;
  border : 1px solid white;
`;
const StyledCardAccent = styled.div`
  background: linear-gradient(45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%,
  rgba(255, 0, 0, 1) 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 8px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
  position: relative;
  text-align: center;
  &:before {
    opacity : 0.4;
  }
`

const CardContainer = styled.div`
  padding: 24px;
  z-index : 2;
  border-radius: 8px;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface AutoFarmCard {
  farm: AutoFarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const AutoFarmCard: React.FC<AutoFarmCard> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const TranslateString = useI18n()
  const [staked, setStaked] = useState(0);
  const [depositFee, setDepositFee] = useState(0);
  const [locked, setLocked] = useState(0);
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const farmAddress = farm.clusterContract[process.env.REACT_APP_CHAIN_ID];
  const farmContract = useCluster(farmAddress);
  console.log('Cluster data')
  console.log(farm)
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  //
  // apy hesabı ekle
  //

  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`
  const getTotalStaked = useEffect(() => {
    async function getStakedValue() {
      const value = await autoFarmTotal(farmContract)
      console.log(value.toString())
      setStaked(getBalanceNumber(value))
    }
    getStakedValue()
  }, [farmContract])

  const getTimeLock = useEffect(() => {
    async function getLock() {
      const value = await clusterLock(farmContract)
      setLocked(value)
    }
    getLock()
  }, [farmContract])

  const getDepositFee = useEffect(() => {
    async function depfee() {
      const value = await autoFarmDepositFee(farmContract)
      setDepositFee(value)
    }
    depfee()
  }, [farmContract])

  const totalValue: BigNumber = useMemo(() => {
      return cakePrice.times(staked)

  }, [ cakePrice, staked])

  const totalValueFormated = staked
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const farmAPY = farm.apy && farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk, image, earnToken, depositToken, isAuto, harvestInterval, clusterContract } = farm

  return (
    <FCard>
      {/* {farm.tokenSymbol === 'EGG' && <StyledCardAccent />} */}
      <CardContainer>
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        risk={risk}
        depositFee={farm.depositFeeBP}
        farmImage={farmImage}
        tokenSymbol={farm.tokenSymbol}
        image={image}
        earnToken={earnToken}
      />
      {!removed && (
        <Flex justifyContent='space-between' alignItems='center'>
          <Text  fontSize="16px" >Estimated APR:</Text>
          <Text  fontSize="16px"  bold style={{ display: 'flex', alignItems: 'center' }}>
            {farm.apy ? (
              <>
                <ApyButton
                  lpLabel={lpLabel}
                  quoteTokenAdresses={quoteTokenAdresses}
                  quoteTokenSymbol={quoteTokenSymbol}
                  tokenAddresses={tokenAddresses}
                  cakePrice={cakePrice}
                  apy={farm.apy}
                />
                {farmAPY}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text> 
            </Flex>
      )}
      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >Deposit:</Text>
        <Text  fontSize="16px" color="primary" bold>{depositToken}</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >{TranslateString(318, 'Earn')}:</Text>
        <Text   fontSize="16px" color="primary" bold>{earnToken}</Text>
      </Flex>

      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >{TranslateString(10001, 'Deposit Fee')}:</Text>
        <Text  fontSize="16px"  >{(depositFee / 100)}%</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >Auto Compound:</Text>
        <Text  fontSize="14px" >True</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >Vesting Time:</Text>
        <Text  fontSize="14px" >{formatTimePeriod(getTimePeriods(locked))}</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >Total Staked:</Text>
        <Text  fontSize="16px" >{totalValueFormated}</Text>
      </Flex>
      <CardActionsContainer farm={farm} ethereum={ethereum} account={account} clusterContract={clusterContract} timeLock={locked}/>
      </CardContainer>

    </FCard>
  )
}

export default AutoFarmCard
