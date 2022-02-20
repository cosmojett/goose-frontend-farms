import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser, usePriceCakeBusd } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove, useApproveAddress, useCheckVaultApprovalStatus, useVaultApprove } from 'hooks/useApprove'
import { userAllowance } from 'utils/callHelpers'
import StakeAction from './StakeAction'
import { getCakeVaultEarnings } from './helpers'
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
  vaultData?:any
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account, autoFarmContract, vaultData }) => {

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()
  const cakePriceBusd = usePriceCakeBusd()

  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay, cakeAsBigNumber } = getCakeVaultEarnings(
    account,
    vaultData.buzzAtLastUserAction,
    vaultData.userShares,
    vaultData.pricePerFullShare,
    cakePriceBusd.toNumber(),
  )
  const { handleVaultApprove } = useVaultApprove()

  const vaultApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await handleVaultApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [handleVaultApprove])

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
        if(account) {
          const allowancex = await  userAllowance(lpContract, farmContract, account);
          setAllowance(new BigNumber(allowancex))
        }

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
    return isVaultApproved ? (
      <>
      <StakeAction account={account} farmAddress={farmContract} stakedBalance={cakeAsBigNumber} tokenBalance={tokenBalance} tokenName={lpName} pid={pid} depositFeeBP={depositFeeBP} userShares={vaultData.userShares} pricePerFullShare={vaultData.pricePerFullShare} />
              <Flex>
          <Text bold textTransform="uppercase" color="primary" fontSize="12px" pr="3px">
            Your Amount (Compounding)
          </Text>
        </Flex>
        </>
    ) : (

        <Button  disabled={requestedApproval} onClick={vaultApprove}>
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
