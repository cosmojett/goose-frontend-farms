import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { usePriceCakeBusd } from 'state/hooks'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import useStake from '../../../../hooks/useStake'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  netTime?: number
  timeText?: string
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid, netTime, timeText}) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const { onStake } = useStake(pid)
  const buzzPrice = usePriceCakeBusd()

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()
  const displayBalanceUSD = buzzPrice.times(new BigNumber(rawEarningsBalance)).toFixed(2)

  return (
    <Flex mb='8px' justifyContent='space-between' alignItems='center'>
      <Flex mb='8px' mt='8px' justifyContent='space-between' alignItems='flex-start' flexDirection='column'>
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      <Text fontSize="16px" color="primary" bold>{displayBalanceUSD} $</Text>
      </Flex>
      <BalanceAndCompound>
        {pid === 12 ?
          <Button
            disabled={rawEarningsBalance === 0 || pendingTx}
            size='sm'
            variant='secondary'
            marginBottom='15px'
            onClick={async () => {
              setPendingTx(true)
              await onStake(rawEarningsBalance.toString())
              setPendingTx(false)
            }}
          >
            {TranslateString(999, 'Compound')}
          </Button>
          : null}
        <Button
          disabled={rawEarningsBalance === 0 || pendingTx || netTime > 0}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {netTime > 0 ? timeText : 'Harvest'}
        </Button>
      </BalanceAndCompound>
    </Flex>
  )
}

export default HarvestAction
