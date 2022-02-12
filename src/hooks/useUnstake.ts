import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { unstake, sousUnstake, sousEmegencyUnstake, autoFarmWithdrawAll, galaxyBurn } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useAutoFarm, useGalaxy } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export const useGalaxyBurn = (galaxyAddress: string) => {
  const { account } = useWallet()
  const contract = useGalaxy(galaxyAddress)
  
  const handleBurn = useCallback(
    async (amount: string) => {
      const txHash = await galaxyBurn(contract, amount, account)
      console.info(txHash)
    }, [account, contract]
  )

  return { onBurn: handleBurn }
}


export const useAutoFarmWithdraw = (farmAddress: string) => {
  const { account } = useWallet()
   const contract = useAutoFarm(farmAddress)

   const handleUnstake = useCallback(
     async () => {
       const txHash = await autoFarmWithdrawAll(contract, account)
       console.info(txHash)
     }, [contract, account]
   )
   return { onUnstake : handleUnstake }
}

const SYRUPIDS = [5, 6, 3, 1, 22, 23]

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, isOldSyrup, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
