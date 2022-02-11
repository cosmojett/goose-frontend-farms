import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig, Indexes } from 'config/constants/types'

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  // quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: number
  depositFeeBP?: number
  harvestInterval?: string
  buzzPerBlock?: number
    userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
    nextHarvest?: BigNumber
    currentTime? : BigNumber
  }

}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface IndexExtended extends Indexes {
  userData?: {
    allowance: BigNumber
    indexBalance: BigNumber
    indexTokenBalance: BigNumber
  }
}

// Slices states

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

export interface IndexState {
  data : IndexExtended[]
}

// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
  indexes: IndexState
}
