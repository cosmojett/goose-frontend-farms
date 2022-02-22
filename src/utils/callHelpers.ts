import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import ERC20 from 'config/abi/erc20.json'
import { getContract } from 'utils/web3'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveToAddress = async(tokenContract, spender, account) => {
  return tokenContract.methods
    .approve(spender, ethers.constants.MaxUint256)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const approveToAddressNoContract = async(tokenContract, spender, account) => {
  const contract = getContract(ERC20,tokenContract)
  return contract.methods
    .approve(spender, ethers.constants.MaxUint256)
    .send({ from: account })
}


export const userAllowance = async(tokenContract, spender, account) => {
  return tokenContract.methods
    .allowance(account, spender)
    .call()
}

export const autoFarmSharePrice = async(autofarm) => {
  return autofarm.methods
  .getPricePerFullShare()
  .call()
}

export const autoFarmTotal = async(autofarm) => {
  return autofarm.methods
  .balanceOf()
  .call()
}

export const autoFarmDepositFee = async(autofarm) => {
  return autofarm.methods
  .depositFeeBP()
  .call()
}

export const clusterLock = async (cluster) => {
  return cluster.methods
  .timeLock()
  .call()
}

export const clusterUserInfo = async (cluster, account) => {
  return cluster.methods
  .userInfo(account)
  .call()
}

export const galaxyTotalSupply = async(galaxy) => {
  return galaxy.methods
  .totalSupply()
  .call()
}

export const galaxyPrice = async(galaxy,amount) => {
  return galaxy.methods
  .mintWithStablePrice(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  .call()
}

export const galaxyComponentPrices = async(galaxy,amount) => {
  return galaxy.methods
  .componentPrices(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  .call()
}

export const galaxyBalance = async(galaxy,account) => {
  return galaxy.methods
  .balanceOf(account)
  .call()
}

export const galaxyComponentAmounts = async(galaxy, amount) => {
  return galaxy.methods
  .tokenMintAmounts(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  .call()
}

export const galaxyMint = async(galaxy, amount, account) => {
  return galaxy.methods
  .mintGalaxy(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  .send({from : account})
  .on('transactionHash', (tx) => {
    return tx.transactionHash
  })
}

export const galaxyBurn = async(galaxy, amount, account) => {
  return galaxy.methods
  .burnGalaxy(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  .send({from : account})
  .on('transactionHash', (tx) => {
    return tx.transactionHash
  })
}

export const userAutoFarmStakes = async(autofarm, account) => {
  return autofarm.methods
  .userInfo(account)
  .call()
}

export const autoFarmStake = async (contract, amount, account) => {
  return contract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from : account})
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const autoFarmTotalBalance = async (contract) => {
  return contract.methods
  .balanceOf()
  .call()
}

export const autoFarmStaked = async (masterChef, autoFarm, poolId) => {
  return masterChef.methods
  .userInfo(poolId, autoFarm)
  .call()
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString() })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const autoFarmWithdrawAll = async (contract, account) => {
  return contract.methods
    .withdrawAll()
    .send({ from : account})
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: new BigNumber(0) })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
