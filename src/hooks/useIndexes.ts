import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import cakeABI from 'config/abi/cake.json'
import ERC20 from 'config/abi/erc20.json'
import indexes from 'config/abi/index.json'
import { getContract } from 'utils/web3'
import { getTokenBalance, getAllowanceToken } from 'utils/erc20'
import { getCakeAddress, getMasterChefAddress } from 'utils/addressHelpers'
import useRefresh from './useRefresh'

export const useIndexMintFee = (indexAddress: string) => {
    const [fee, setFee] = useState(0)
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        const fetchBalance = async () => {
        const indexContract = getContract(indexes, indexAddress)
        const f = await indexContract.methods.mintFee().call()
        setFee(f)

        }

        fetchBalance()
    }, [indexAddress, slowRefresh])

    return fee
}

export const useIndexBurnFee = (indexAddress: string) => {
    const [fee, setFee] = useState(0)
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        const fetchBalance = async () => {
        const indexContract = getContract(indexes, indexAddress)
        const f = await indexContract.methods.burnFee().call()
        setFee(f)

        }

        fetchBalance()
    }, [indexAddress, slowRefresh])

    return fee
}

export const useIndexBalance = (indexAddress: string, userAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      if(userAddress) {
        const indexContract = getContract(indexes, indexAddress)
        const bal = await indexContract.methods.balanceOf(userAddress).call()
        setBalance(new BigNumber(bal))
      }
    }

    fetchBalance()
  }, [indexAddress, slowRefresh, userAddress])

  return balance
}

export const useIndexSupply = (indexAddress: string) => {
  const [supply, setSupply] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchSupply = async () => {
        const indexContract = getContract(indexes, indexAddress)
        const sup = await indexContract.methods.totalSupply().call()
        setSupply(new BigNumber(sup))
    }

    fetchSupply()
  }, [indexAddress, slowRefresh])

  return supply
}

export const useIndexPrice = (indexAddress: string) => {
    const [price, setPrice] = useState(new BigNumber(0))
    const { slowRefresh } = useRefresh()
    useEffect(() => {
        const fetchPrice = async () => {
            const indexContract = getContract(indexes, indexAddress)
            const pr = await indexContract.methods.getIndexBasePrice().call()
            setPrice(new BigNumber(pr))
        }

        fetchPrice()
    }, [indexAddress, slowRefresh])

    return price
}

export interface ComponentPrices {
    token : string;
    price : BigNumber
}

export const useIndexComponentPrices = (indexAddress: string) => {
    const [components, setComponents] = useState<ComponentPrices[]>([]);
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        const fetchComponents = async () => {

            const indexContract = getContract(indexes, indexAddress);
            const comp = await indexContract.methods.componentPrices(new BigNumber(1).times(new BigNumber(10).pow(18))).call();
            const comps = comp.map((c) => {
                return {
                    token : c.token.toString(),
                    price : new BigNumber(c.amount)
                }
            })
            setComponents(comps)
        }

        fetchComponents();
    }, [indexAddress, slowRefresh])

    return components;
}

export const useIndexZapAllowance = (indexAddress: string, account: string, stable: string) => {
    const [allowance, setAllowance] = useState(new BigNumber(0))
    const { slowRefresh } = useRefresh()
    useEffect(() => {
        const fetchAllowance = async () => {
            const stableContract = getContract(ERC20, stable);
            const allow = await getAllowanceToken(stableContract, indexAddress, account)
            setAllowance(new BigNumber(allow))
        }
        if(account) {
            fetchAllowance()
        }
    }, [indexAddress, account, stable, slowRefresh])

    return allowance
}
