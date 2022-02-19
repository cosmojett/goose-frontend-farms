import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BLOCKS_PER_YEAR } from 'config'
import useRefresh from 'hooks/useRefresh'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAutoAprData } from 'views/Farms/components/AutoFarm/helpers'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync, fetchCakeVaultPublicData, fetchCakeVaultUserData, fetchCakeVaultFees } from './actions'
import { State, Farm, Pool, IndexExtended } from './types'
import { QuoteToken } from '../config/constants/types'



const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchCakeVaultPublicData())
    dispatch(fetchFarmsPublicDataAsync())
    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

export const useFetchCakeVault = (account) => {
  // const { account } = useWallet()
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCakeVaultPublicData())
  }, [dispatch, fastRefresh])

   useEffect(() => {
     dispatch(fetchCakeVaultUserData({ account }))
   }, [dispatch, fastRefresh, account])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
    nextHarvest: farm.userData ? new BigNumber(farm.userData.nextHarvest) : new BigNumber(0),
    currentTime: farm.userData ? new BigNumber(farm.userData.currentTime) : new BigNumber(0),
  }
}

export const useIndexFromId = (id): IndexExtended => {
  const galaxy = useSelector((state: State) => state.indexes.data.find((f) => f.id === id))
  return galaxy;
}

export const useIndexUser = (id) => {
  const galaxy = useIndexFromId(id);
  return {
    allowance : galaxy.userData? new BigNumber(galaxy.userData.allowance) : new BigNumber(0),
    indexBalance : galaxy.userData? new BigNumber(galaxy.userData.indexBalance) : new BigNumber(0),
    indexTokenBalance : galaxy.userData? new BigNumber(galaxy.userData.indexTokenBalance) : new BigNumber(0)
  }
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 4 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}


export const usePriceCakeBusd = (): BigNumber => {
  const bnbPrice = usePriceBnbBusd();
  const pid = 1;
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(bnbPrice) : new BigNumber(0.0285);

}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken && !farm.isCluster) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      }else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = (cakePrice.times(farm.lpTotalInQuoteToken));
      }else{
        val = (farm.lpTotalInQuoteToken);
      }
      value = value.plus(val);
    }
  }
  return value;
}

export const useAutoFarmApy = (pid): number => {
  const farm = (useFarmFromPid(pid))
  const {
    fees: { performanceFee }
  } = useCakeVault()

  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const cakeRewardPerBlock = new BigNumber(farm.buzzPerBlock || 1)
          .times(new BigNumber(farm.poolWeight))
          .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)
        // alert(cakeRewardPerBlock)
        let apy = cakePrice.times(cakeRewardPerYear)
        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0)

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice)
        }

        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }
       const AutoApy = getAutoAprData(apy.times(new BigNumber(100)).toNumber(),performanceFee)
       const apyFinal = AutoApy.apr
  return apyFinal
}

export const useCakeVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalBuzzInVault: totalBuzzInVaultAsString,
    estimatedBuzzBountyReward: estimatedBuzzBountyRewardAsString,
    totalPendingBuzzHarvest: totalPendingBuzzHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    tokenTaxRate,

    userData: {
      isLoading,
      userShares: userSharesAsString,
      buzzAtLastUserAction: buzzAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.farms.cakeVault)
  const cakeVault = useSelector((state: State) => state.farms.cakeVault);
  console.log('vault data')
  console.log(cakeVault)
  const estimatedBuzzBountyReward = useMemo(() => {
    return new BigNumber(estimatedBuzzBountyRewardAsString)
  }, [estimatedBuzzBountyRewardAsString])

  const totalPendingBuzzHarvest = useMemo(() => {
    return new BigNumber(totalPendingBuzzHarvestAsString)
  }, [totalPendingBuzzHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalBuzzInVault = useMemo(() => {
    return new BigNumber(totalBuzzInVaultAsString)
  }, [totalBuzzInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const buzzAtLastUserAction = useMemo(() => {
    return new BigNumber(buzzAtLastUserActionAsString)
  }, [buzzAtLastUserActionAsString])

  return {
    totalShares,
    pricePerFullShare,
    totalBuzzInVault,
    estimatedBuzzBountyReward,
    totalPendingBuzzHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      buzzAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}