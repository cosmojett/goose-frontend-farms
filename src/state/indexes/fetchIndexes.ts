import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import index from 'config/abi/index.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import indexes from 'config/constants/indexes'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchIndexes = async () => {
    const data = Promise.all(
        indexes.map(async (galaxy) => {
            const galaxyContract = galaxy.contract;
            const priceCall = [
                // price of index token
                {
                    address : galaxyContract,
                    name : 'mintWithStablePrice',
                    params : ['100000000']
                }, 
                {
                    address : galaxyContract,
                    name : 'totalSupply',
                    params : []
                }
            ]
            const [ price, supply ] = await multicall(index, priceCall)
            const balanceCalls = galaxy.tokens.map((token) => {
                return {
                    address : token.contract[CHAIN_ID],
                    name : 'balanceOf',
                    params : [galaxyContract]
                }
            })

            const balances = await multicall(erc20,balanceCalls);

            return {
                ...galaxy,
                componentBalances : balances.toJSON(),
                galaxyPrice : new BigNumber(price).times(new BigNumber(10).pow(10)).toJSON(),
                totalSupply : supply.toJSON()
            }
        })
    )
}

export default fetchIndexes;