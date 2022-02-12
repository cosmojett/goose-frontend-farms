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
    const [balances, setBalances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [allowances, setAllowances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [tokenApproves, setTokenApproves] = useState();
    const [tokenMintAmounts, setTokenMintAmounts] = useState(Array(tokens.length));
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
                const balancex = await getTokenBalance(ethereum,tokens[i].contract[process.env.REACT_APP_CHAIN_ID],account)
                console.log(allowance.toString())
                _balances[i] = balancex;
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
    async (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      try {
        const amounts = await galaxyComponentAmounts(GalaxyContract,e.currentTarget.value.replace(',','.'))
        setTokenMintAmounts(amounts)
      } catch (ex) {
        console.error(ex)
      }

    },
    [setVal, GalaxyContract],
  )



  return (
    <Modal title={`Burn ${name}`} onDismiss={onDismiss}>

      <TokenInput
        value={val}
        onChange={handleChange}
        max={balance.toNumber()}
        symbol={name}
      />

        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20, paddingTop : 10}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>With burning {val} amount of {name} you will get these amount of tokens.</Text>
        </Flex>

        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Amounts</Text>
        </Flex>
        {tokenMintAmounts.map((token,index) => (
        <Flex alignItems='center' justifyContent='center' style={{paddingTop : 5, paddingBottom : 5}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}> { token[0] ? new BigNumber(token[0]).dividedBy(new BigNumber(10).pow(18)).toFixed(5) : new BigNumber(0)} {tokens[index].name}</Text>
        </Flex>
        ))}

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
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
