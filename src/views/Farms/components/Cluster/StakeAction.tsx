import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useAutoFarmStake } from 'hooks/useStake'
import { usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import useUnstake, { useAutoFarmWithdraw } from 'hooks/useUnstake'
import { useAutoFarm } from 'hooks/useContract'
import { getBalanceNumber } from 'utils/formatBalance'
import { userAutoFarmStakes, autoFarmSharePrice, autoFarmPending, autoFarmTotalShares, autoFarmTotalBalance } from 'utils/callHelpers'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
  farmAddress?: string
  account?: string
  withdrawAvailable?: boolean
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({account, farmAddress,  stakedBalance, tokenBalance, tokenName, pid, depositFeeBP, withdrawAvailable}) => {
  const TranslateString = useI18n()
  const { onStake } = useAutoFarmStake(farmAddress)
  const { onUnstake } = useAutoFarmWithdraw(farmAddress)
  const [balance, setBalance] = useState(new BigNumber(0))
  const [balanceUSD, setBalanceUSD] = useState(new BigNumber(0))
  const rawStakedBalance = getBalanceNumber(balance)
  const buzzPrice = usePriceCakeBusd()
  const { slowRefresh } = useRefresh()
  // user balanceı getir yazdır
  const displayBalance = rawStakedBalance.toLocaleString()

  const farmContract = useAutoFarm(farmAddress);

  const userBalance = useEffect(() => {
    async function fetchBalance() {
      try {
        const _balance = await userAutoFarmStakes(farmContract,account);
        const pending = await autoFarmPending(farmContract)
        const totalShares = await autoFarmTotalShares(farmContract)
        const shares = _balance.shares;
        console.log(`Share : ${shares.toString()}`)
        const sharePrice = new BigNumber(pending).times(new BigNumber(10).pow(18)).dividedBy(new BigNumber(totalShares))

        const userBal = new BigNumber(shares).times(getBalanceNumber(new BigNumber(sharePrice)))
        const displayBalanceUSD = buzzPrice.times(userBal).dividedBy(new BigNumber(10).pow(18))
        setBalance(userBal);
        setBalanceUSD(displayBalanceUSD);
      } catch (e) {
        console.error(e)
      }
    }
    fetchBalance()
  }, [farmContract, account, slowRefresh, buzzPrice])

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName='BUZZ' depositFeeBP={depositFeeBP} isCluster/>)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName='BUZZ' />,
  )

  const withdrawAll = async function() {
    await onUnstake()
  }

  const renderStakingButtons = () => {
    return balance.isEqualTo(0) ? (
      <Button onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <IconButton disabled={withdrawAvailable} variant="tertiary" onClick={() =>  withdrawAll()} mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
            <Flex mb='8px' mt='8px' justifyContent='space-between' alignItems='flex-start' flexDirection='column'>
            <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance} $BUZZ</Heading>
            <Text fontSize="16px" color="primary" bold>{balanceUSD.toFixed(2)} $</Text>
            </Flex>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
