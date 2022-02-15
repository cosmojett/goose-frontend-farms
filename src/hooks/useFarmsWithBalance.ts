import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import { autoFarmStaked } from 'utils/callHelpers'
import { useMasterchef } from 'hooks/useContract'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingBuzz',
        params: [farm.pid, account],
      }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

      setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export const useCosmicBalance = (cosmicAddress : string) => {
    const [cosmicBalance, setCosmicBalance] = useState(new BigNumber(0))
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()
    const masterchef = useMasterchef()
  useEffect(() => {
    const fetchBalances = async () => {
      
      const balance = await autoFarmStaked(masterchef, cosmicAddress, 0);

      setCosmicBalance(new BigNumber(balance.amount))
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh, cosmicAddress, masterchef])

  return cosmicBalance
}


export default useFarmsWithBalance
