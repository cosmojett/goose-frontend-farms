import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import { getContract } from 'utils/web3'
import { ContractOptions } from 'web3-eth-contract'
import { getCosmicFarmAddress } from 'utils/addressHelpers'

import cakeVaultAbi from '../../config/abi/autofarm.json'



export const getCakeVaultContract = (contractOptions?: ContractOptions) => {
  const address= getCosmicFarmAddress()
  const pancakeRabbitsAbi = (cakeVaultAbi as unknown) as AbiItem
  return getContract(pancakeRabbitsAbi, address, contractOptions)
}
const cakeVaultContract = getCakeVaultContract()

export const  fetchVaultUser = async (account: string ) => {

  try {
    const userContractResponse = await cakeVaultContract.methods.userInfo(account).call()
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      buzzAtLastUserAction : new BigNumber(userContractResponse.buzzAtLastUserAction .toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      buzzAtLastUserAction : null,
    }
  }
}

export default fetchVaultUser