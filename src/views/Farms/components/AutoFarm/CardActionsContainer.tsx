import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove, useApproveAddress } from 'hooks/useApprove'
import { userAllowance } from 'utils/callHelpers'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'


const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  autoFarmContract: any
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account, autoFarmContract }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { tokenBalance, stakedBalance, earnings } = useFarmUser(pid)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]

  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const farmContract = autoFarmContract[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => {
    if(isTokenOnly){
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])


  const { onApprove } = useApproveAddress(lpContract, farmContract);
  const getAllowance = useEffect(() => {
    async function fetchAllowance() {
      try {
        const allowancex = await  userAllowance(lpContract, farmContract, account);
        setAllowance(new BigNumber(allowancex))
      } catch (e) {
        console.error(e)
      }
    }
    fetchAllowance()
  }, [lpContract, farmContract, account])

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
      <StakeAction account={account} farmAddress={farmContract} stakedBalance={stakedBalance} tokenBalance={tokenBalance} tokenName={lpName} pid={pid} depositFeeBP={depositFeeBP} />
              <Flex>
          <Text bold textTransform="uppercase" color="primary" fontSize="12px" pr="3px">
            Your Stake
          </Text>
        </Flex>
        </>
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
