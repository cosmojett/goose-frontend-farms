import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getWeb3 } from 'utils/web3'
import { getContract } from 'utils/erc20'
import getTimePeriods from 'utils/getTimePeriods'
import formatTimePeriod from 'utils/formatTimePeriod'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  nextHarvest? : BigNumber
  currentTime? : BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, earnings, nextHarvest, currentTime } = useFarmUser(pid)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const netTime = (nextHarvest.toNumber() - currentTime.toNumber()) > 0 ? nextHarvest.toNumber() - currentTime.toNumber() : 0
  const timeText = formatTimePeriod(getTimePeriods(netTime))
  // console.log(timeText)
  console.log(`Pid : ${pid} , token Balance : ${tokenBalance}, Allowance : ${allowance.toString()}`)


  const lpContract = useMemo(() => {
    if(isTokenOnly){
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <>
                <Flex>
          <Text bold textTransform="uppercase" color="primary" fontSize="12px" pr="3px">
            {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
            {farm.earnToken}
          </Text>
          <Text bold textTransform="uppercase" color="contrast" fontSize="12px">
            {TranslateString(999, 'Earned')}
          </Text>
        </Flex>
        <HarvestAction earnings={earnings} pid={pid} netTime={netTime} timeText={timeText} />
        <Flex>
          <Text bold textTransform="uppercase" color="primary" fontSize="12px" pr="3px">
            {lpName}
          </Text>
          <Text bold textTransform="uppercase" color="contrast" fontSize="12px">
            {TranslateString(999, 'Staked')}
          </Text>
        </Flex>
        
      <StakeAction stakedBalance={stakedBalance} tokenBalance={tokenBalance} tokenName={lpName} pid={pid} depositFeeBP={depositFeeBP} /></>
    ) : (

        <Button  disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>


    )
  }

  return (
    <Action>
      {!account ? (<UnlockButton mt="8px" fullWidth />) : (
        <>
        {renderApprovalOrStakeButton()}
        </>
      )}
    </Action>
  )
}

export default CardActions
