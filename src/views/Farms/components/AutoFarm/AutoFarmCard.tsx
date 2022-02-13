import React, { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { useAutoFarm } from 'hooks/useContract'
import { useCakeVault } from 'state/hooks'
import { BLOCKS_PER_YEAR } from 'config'
import { autoFarmTotal, autoFarmDepositFee } from 'utils/callHelpers'
import { fetchPublicVaultData } from 'state/farms/fetchVaultPublic'
import { getBalanceNumber } from 'utils/formatBalance'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import { getAutoAprData } from './helpers'
import ApyButton from './ApyButton'

export interface AutoFarmWithStakedValue extends Farm {
  apy?: BigNumber
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

// APY VS ORDAN DEVAM ET DATAYI ÇEKTİK
interface AutoFarmCard {
  farm: AutoFarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const AutoFarmCard: React.FC<AutoFarmCard> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {

  fetchPublicVaultData()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading ,buzzAtLastUserAction, lastUserActionTime},
    fees: { performanceFee },
    totalBuzzInVault,
    pricePerFullShare,
    totalPendingBuzzHarvest,
  } = useCakeVault()
  const accountHasSharesStaked = userShares && userShares.gt(0)
  // alert(accountHasSharesStaked)
  const isLoading = !farm.userData || isVaultUserDataLoading
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  // console.log(`totalPendingWisteriaHarvest:${totalPendingWisteriaHarvest}`)

  const vaultData = {
    userShares,
    buzzAtLastUserAction,
    lastUserActionTime,
    pricePerFullShare,
  }


  const totalValue: BigNumber = useMemo(() => {
    //   if(farm.isTokenOnly){

    //    return cakePrice.times(farm.lpTotalInQuoteToken)
    //  }
    console.log(`Total value in buzz vault : ${totalBuzzInVault}`)
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if(farm.isAuto){
      return cakePrice.times(getBalanceNumber(totalBuzzInVault, 18))
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }

    // if(farm.isTokenOnly){

    //   return bnbPrice.times(farm.lpTotalInQuoteToken)
    // }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol,farm.isAuto,totalBuzzInVault])
  // console.log(performanceFeeAsDecimal)
  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '-'

    const lpLabel = farm.lpSymbol
    const farmAPY = farm.apy && farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    console.log(totalValue ? `Total value : ${totalValue.toString()}` : 'no total value')
    console.log(farm)
    console.log(`APR: ${farmAPY}`)
    
  const cakeRewardPerBlock = new BigNumber(farm.buzzPerBlock || 1)
    .times(new BigNumber(farm.poolWeight).minus(new BigNumber(0.1)))
    .div(new BigNumber(10).pow(18))
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk, image, earnToken, depositToken, isAuto, harvestInterval, autoFarmContract } = farm
  const AutoApr = getAutoAprData(farm.apy.times(new BigNumber(100)).toNumber(),0)
  console.log(`Auto Apr : ${AutoApr}`)
  console.log(AutoApr)
  const AutoAprAsPerchantage = AutoApr.apr.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })



  const TranslateString = useI18n()
  const [staked, setStaked] = useState(0);
  const [depositFee, setDepositFee] = useState(0);
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const farmAddress = farm.autoFarmContract[process.env.REACT_APP_CHAIN_ID];
  const farmContract = useAutoFarm(farmAddress);
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

  const getDepositFee = useEffect(() => {
    async function depfee() {
      const value = await autoFarmDepositFee(farmContract)
      setDepositFee(value)
    }
    depfee()
  }, [farmContract])






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
          <Text  fontSize="16px" >{TranslateString(352, 'APR')}:</Text>
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
                {AutoAprAsPerchantage}%
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
        <Text  fontSize="14px" >{isAuto ? 'True' : 'False'}</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text  fontSize="16px" >Total Liquidity:</Text>
        <Text  fontSize="16px" >{totalValueFormated}</Text>
      </Flex>
      <CardActionsContainer farm={farm} vaultData={vaultData} ethereum={ethereum} account={account} autoFarmContract={autoFarmContract} />
      </CardContainer>

    </FCard>
  )
}

export default AutoFarmCard
