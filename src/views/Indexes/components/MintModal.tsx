import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { provider } from 'web3-core'
import { Button, Modal, Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { useApproveAddress } from 'hooks/useApprove'
import { getAllowanceForAddress, getTokenBalance, getContract } from 'utils/erc20'
import { IndexToken } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface MintModalProps {
    tokens: IndexToken[]
    contract: string
    name: string
    onDismiss?: () => void
    onConfirm: (amount: string) => void
    account?: string
    ethereum?: provider
}

const MintModal: React.FC<MintModalProps> = ({ tokens, contract, name, onDismiss, onConfirm, ethereum, account}) => {
  const [val, setVal] = useState('')
  
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
    const [balances, setBalances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [allowances, setAllowances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [tokenApproves, setTokenApproves] = useState();
/* eslint-disable no-await-in-loop */
    const getBalances = useEffect(() => {
        async function fetchBalances() {
            let i = 0;
            const _balances = [];
            const _allowances = [];
            const _tokenApproves = [];
            for(const token of tokens) {
                const tokenContract = getContract(ethereum, tokens[i].contract[process.env.REACT_APP_CHAIN_ID])
                const allowance = await getAllowanceForAddress(tokenContract,contract,account)
                const balance = await getTokenBalance(ethereum,tokens[i].contract[process.env.REACT_APP_CHAIN_ID],account)
                console.log(allowance.toString())
                _balances[i] = balance;
                _allowances[i] = allowance;
                i += 1;
            }
            setBalances(_balances);
            setAllowances(_allowances);
        }
        fetchBalances();
    }, [tokens, ethereum, contract, account])
/* eslint-disable no-await-in-loop */
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )



  return (
    <Modal title={`Mint ${name}`} onDismiss={onDismiss}>
        <Flex alignItems='center' justifyContent='space-between' style={{ paddingBottom : 20}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Balance</Text>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Approval</Text>
        </Flex>
        {tokens.map((token,index) => (
        <Flex alignItems='center' justifyContent='space-between' style={{paddingTop : 5, paddingBottom : 5}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{new BigNumber(balances[index]).dividedBy(new BigNumber(10).pow(18)).toFixed(5)} {token.name } </Text>
            <Button variant="primary"  size='sm' disabled={new BigNumber(allowances[index]).isGreaterThan(0) && pendingTx}
            onClick={() => {
                    console.log('approve')
            }}>
                Approve
            </Button>
        </Flex>
        ))}
      <TokenInput
        value={val}
        onChange={handleChange}
        max=''
        symbol={name}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            /* setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss() */
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center'}}>To mint {val} {name} you have to provide these amount of tokens</Text>
        </Flex>

        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Amounts</Text>
        </Flex>
        {tokens.map((token,index) => (
        <Flex alignItems='center' justifyContent='center' style={{paddingTop : 5, paddingBottom : 5}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{new BigNumber(balances[index]).dividedBy(new BigNumber(10).pow(18)).toFixed(5)} {token.name } </Text>
        </Flex>
        ))}
    </Modal>
  )
}

export default MintModal
