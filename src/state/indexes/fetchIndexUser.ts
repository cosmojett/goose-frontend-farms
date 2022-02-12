import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import indexes from 'config/constants/indexes'
import { parse } from 'path'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchIndexUserAllowances = (account: string) => {
    const indexAllowances = indexes.map(async (galaxy) => {
        // burda return index id si ve
        const tokenCalls = galaxy.tokens.map((token) => {
            return {
                address : token.contract[CHAIN_ID],
                name : 'allowance',
                params : [account, galaxy.contract]
            }
        })

        const rawLpAllowances = await multicall(erc20ABI, tokenCalls)
        const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
            return new BigNumber(lpBalance).toJSON()
        })
        return {
            name : galaxy.name,
            id : galaxy.id,
            allowance : parsedLpAllowances
        }
    })

    const data = Promise.all(indexAllowances)

    return data;
}

export const fetchIndexUserBalances = async (account: string) => {
    const calls = indexes.map((galaxy) => {
        return {
            address : galaxy.contract,
            name : 'balanceOf',
            params : [account]
        }
    })
    const rawTokenBalances = await multicall(erc20ABI, calls)
    const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
      return new BigNumber(tokenBalance).toJSON()
    })
    return parsedTokenBalances
}

export const fetchIndexUserTokenBalances = async (account: string) => {
    let tokenCalls;
    const balanceCalls = indexes.map((galaxy) => {
        tokenCalls = galaxy.tokens.map((token) => {
            return {
                address : token.contract[CHAIN_ID],
                name : 'balanceOf',
                params : [account]
            }
        })
        return tokenCalls;
    })

    const rawTokenBalances = await multicall(erc20ABI, tokenCalls)
    const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
      return new BigNumber(tokenBalance).toJSON()
    })
    return parsedTokenBalances
}