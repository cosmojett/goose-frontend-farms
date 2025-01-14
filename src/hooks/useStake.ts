import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb, autoFarmStake, galaxyMint } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useAutoFarm, useGalaxy } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useGalaxyMint = (galaxyAddress: string) => {
  const { account } = useWallet()
  const contract = useGalaxy(galaxyAddress)
  
  const handleMint = useCallback(
    async (amount: string) => {
      const txHash = await galaxyMint(contract, amount, account)
      console.info(txHash)
    }, [account, contract]
  )

  return { onMint: handleMint }
}

export const useAutoFarmStake = (farmAddress: string) => {

  const { account } = useWallet()
  const contract = useAutoFarm(farmAddress)

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await autoFarmStake(contract, amount, account)
      console.info(txHash)
    }, [account, contract]
  )
  return { onStake : handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
