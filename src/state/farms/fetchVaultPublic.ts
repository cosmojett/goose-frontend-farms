import BigNumber from 'bignumber.js'
// import { convertSharesToCake } from 'views/Pools/helpers'
import multicall from 'utils/multicall'
import cakeVaultAbi from 'config/abi/autofarm.json'
import { getCosmicFarmAddress } from 'utils/addressHelpers'

export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(new BigNumber(10).pow(decimals))
}
export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}
export const convertSharesToCake = (
  shares: BigNumber,
  cakePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(cakePerFullShare, decimals)
  const amountInCake = new BigNumber(shares.multipliedBy(sharePriceNumber))
  const cakeAsNumberBalance = getBalanceNumber(amountInCake, decimals)
  const cakeAsBigNumber = getDecimalAmount(new BigNumber(cakeAsNumberBalance), decimals)
  const cakeAsDisplayBalance = getFullDisplayBalance(amountInCake, decimals, decimalsToRound)
  return { cakeAsNumberBalance, cakeAsBigNumber, cakeAsDisplayBalance }
}
export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestCakeRewards',
      'calculateTotalPendingBuzzRewards',
    ].map((method) => ({
      address: getCosmicFarmAddress(),
      name: method,
    }))



    const [sharePrice, shares, estimatedBuzzBountyReward, totalPendingBuzzHarvest] = await multicall(cakeVaultAbi,
      calls,
    )

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : new BigNumber(0)
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : new BigNumber(0)
    
    const totalBuzzInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
   
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalBuzzInVault: totalBuzzInVaultEstimate.cakeAsBigNumber.toJSON(),
      estimatedBuzzBountyReward: new BigNumber(estimatedBuzzBountyReward.toString()).toJSON(),
      totalPendingBuzzHarvest: new BigNumber(totalPendingBuzzHarvest.toString()).toJSON(),
    }
  } catch (error) {
    console.error('error on fetch pub')
    console.log(error)
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalWisteriaInVault: null,
      estimatedWisteriaBountyReward: null,
      totalPendingWisteriaHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getCosmicFarmAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicall(cakeVaultAbi, calls)
    return {
      performanceFee: performanceFee.toNumber(),
      callFee: callFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }

  } catch (error) {
    console.log('error on fetch fees')
    console.log(error)
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData