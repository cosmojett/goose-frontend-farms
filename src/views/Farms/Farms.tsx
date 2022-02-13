import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import AutoFarmCard, { AutoFarmWithStakedValue } from './components/AutoFarm/AutoFarmCard';
import ClusterCard from './components/Cluster/ClusterCard';
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'

export interface FarmsProps{
  tokenMode?: boolean
}

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const {tokenMode} = farmsProps;

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) =>  farm.multiplier !== '0X' && !farm.isAuto && !farm.isCluster)
  const inactiveFarms = farmsLP.filter((farm) =>  farm.multiplier === '0X' && !farm.isAuto && !farm.isCluster)

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const autoFarms = farmsLP.filter((farm) => farm.isAuto);
  const clusters = farmsLP.filter((farm) => farm.isCluster);


  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD

  console.log(clusters)

  const autoFarmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        
        const cakeRewardPerBlock = new BigNumber(farm.buzzPerBlock || 1)
          .times(new BigNumber(farm.poolWeight))
          .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)
        // alert(cakeRewardPerBlock)
        let apy = cakePrice.times(cakeRewardPerYear)
        // alert(farm.poolWeight)
        console.log(apy.toNumber())
        console.log(farm)
        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0)

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice)
        }

        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }
        console.log(apy.times(new BigNumber(100)).toNumber())
        return { ...farm, apy }
      })

      return farmsToDisplayWithAPY.map((farm) => (

        <AutoFarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    }, [bnbPrice, account, cakePrice, ethereum]
    
  )

  const clusterList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const autoFarmsWithAPY : AutoFarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        const cakeRewardPerBlock = new BigNumber(farm.buzzPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))

        console.log(`Cluster buzz per block : ${cakeRewardPerBlock.toString()}`)

        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR).toFixed(3)

        const apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);
        console.log(farm)
        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice);
        }


        return { ...farm, apy, yearlyDist : cakeRewardPerYear }
      })

      return autoFarmsWithAPY.map((farm) => (

        <ClusterCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    }, [bnbPrice, account, cakePrice, ethereum]
    
  )
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.buzzPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))
        
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice);
        }

        if(totalValue.comparedTo(0) > 0){
          apy = apy.div(totalValue);
        }

        return { ...farm, apy }
      })

      return farmsToDisplayWithAPY.map((farm) => (

        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <Page>
      <Heading as="h2" size="lg" color="primary" mb="50px" style={{ textAlign: 'center' }}>
          Stake tokens to earn BUZZ
      </Heading>
      <div>
                <Divider />

        <FlexLayout>
          <Route exact path='/farms'>
            {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
          </Route>
          <Route exact path='/clusters'>
            {clusterList(clusters, false)}
          </Route>
          <Route exact path='/cosmic'>
          {autoFarmsList(autoFarms,false)}
          </Route>
        </FlexLayout>
      </div>
    </Page>
  )
}

export default Farms
