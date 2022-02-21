import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { provider } from 'web3-core'
import { Button, Modal, Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { useGalaxy } from 'hooks/useContract'
import { galaxyComponentAmounts } from 'utils/callHelpers'
import { useApproveAddress } from 'hooks/useApprove'
import { useIndexBurnFee } from 'hooks/useIndexes'
import { getAllowanceForAddress, getTokenBalance, getContract } from 'utils/erc20'
import { IndexToken } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface BurnModalProps {
    tokens: IndexToken[]
    contract: string
    name: string
    onDismiss?: () => void
    onConfirm: (amount: string) => void
    account?: string
    ethereum?: provider
    balance? : BigNumber
}

const BurnModal: React.FC<BurnModalProps> = ({ tokens, contract, name, onDismiss, onConfirm, ethereum, account, balance}) => {
  const [val, setVal] = useState('')
  
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const GalaxyContract = useGalaxy(contract);
    const [allowances, setAllowances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [tokenApproves, setTokenApproves] = useState();
    const [tokenMintAmounts, setTokenMintAmounts] = useState(Array(tokens.length));
    const burnFee = useIndexBurnFee(contract);


  const handleChange = useCallback(
    async (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
        console.log(`${val.toString()} , Balance : ${balance.toString()}`)
      try {
        const amounts = await galaxyComponentAmounts(GalaxyContract,e.currentTarget.value.replace(',','.'))
        setTokenMintAmounts(amounts)
      } catch (ex) {
        console.error(ex)
      }

    },
    [setVal, GalaxyContract, balance, val],
  )

  const handleSelectMax = useCallback(async () => {
    setVal(getFullDisplayBalance(balance))
      try {
        const amounts = await galaxyComponentAmounts(GalaxyContract,getFullDisplayBalance(balance).replace(',','.'))
        setTokenMintAmounts(amounts)
      } catch (ex) {
        console.error(ex)
      }
  }, [balance, setVal, GalaxyContract])

  return (
    <Modal title={`Burn ${name}`} onDismiss={onDismiss}>

      <TokenInput
        onSelectMax={handleSelectMax}
        value={val}
        onChange={handleChange}
        max={getFullDisplayBalance(balance)}
        symbol={name}
      />

        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20, paddingTop : 10}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>With burning {val} amount of {name} you will get these amount of tokens.</Text>
        </Flex>
        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20, paddingTop : 10}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>There will be %{burnFee / 100} burn fee applied. These fees will be used to buy-back BUZZ.</Text>
        </Flex>
        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Amounts</Text>
        </Flex>
        {tokenMintAmounts.map((token,index) => (
        <Flex alignItems='center' justifyContent='center' style={{paddingTop : 5, paddingBottom : 5}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}> { token[0] ? new BigNumber(token[0]).dividedBy(new BigNumber(10).pow(18)).toFixed(8) : new BigNumber(0)} {tokens[index].name}</Text>
        </Flex>
        ))}

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx || new BigNumber(val).isGreaterThan(getFullDisplayBalance(balance))}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val.replace(',','.'))
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default BurnModal
