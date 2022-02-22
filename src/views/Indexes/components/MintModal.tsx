import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { provider } from 'web3-core'
import { ethers } from 'ethers'
import { AbiItem } from 'web3-utils'
import { Button, Modal, Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { useGalaxy } from 'hooks/useContract'
import ERC20 from 'config/abi/erc20.json'
import useWeb3 from 'hooks/useWeb3'
import { galaxyComponentAmounts, approveToAddressNoContract } from 'utils/callHelpers'
import { useIndexComponentBalances } from 'hooks/useIndexes'
import { useApproveAddress, useApproveAddressNoContract } from 'hooks/useApprove'
import useRefresh from 'hooks/useRefresh'
import { getAllowanceForAddress, getTokenBalance, getContract } from 'utils/erc20'
import { IndexToken } from 'config/constants/types'
import { getFullDisplayBalance, getFullDisplayBalanceFixed } from 'utils/formatBalance'

interface MintModalProps {
    tokens: IndexToken[]
    contract: string
    name: string
    onDismiss?: () => void
    onConfirm: (amount: string) => void
    onApprove: (token: string) => void
    account?: string
    ethereum?: provider
}

const MintModal: React.FC<MintModalProps> = ({ tokens, contract, name, onDismiss, onConfirm, onApprove, ethereum, account}) => {
    const [val, setVal] = useState('')
  
    const [pendingTx, setPendingTx] = useState(false)
    const TranslateString = useI18n()
    const GalaxyContract = useGalaxy(contract);
    const [pendingTxs, setPendingTxs] = useState(Array(tokens.length).fill(false))
    const [balances, setBalances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [allowances, setAllowances] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [tokenApproves, setTokenApproves] = useState();
    const [tokenMintAmounts, setTokenMintAmounts] = useState(Array(tokens.length));
    const w3 = useWeb3()


    // const { onApprove } = useApproveAddressNoContract(contract)

    const tokenBalances = useIndexComponentBalances(account, tokens.map((token) => token.contract[process.env.REACT_APP_CHAIN_ID]), contract)
  console.log(tokenBalances)


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
    <Modal title={`Mint ${name}`} onDismiss={onDismiss}>
        <Flex alignItems='center' justifyContent='space-between' style={{ paddingBottom : 20}}>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Balance</Text>
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Approval</Text>
        </Flex>
        {tokenBalances.map((token,index) => (

        <Flex alignItems='center' justifyContent='space-between' style={{paddingTop : 5, paddingBottom :10}}>
                  {
                  console.log(token.contract, contract, account)
                  }
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{getFullDisplayBalanceFixed(token.balance,18,6)} {tokens[index].name } </Text>
            <Button variant="primary"  size='sm' disabled={token.allowance.isGreaterThan(0) || pendingTxs[index]}
            onClick={async () => {
                    console.log('approve') // buton görünümünü düzenle
                    let pendings = pendingTxs;
                    pendings[index] = true;
                    setPendingTxs(pendings);
                    const ct = new w3.eth.Contract((ERC20 as unknown) as AbiItem,token.contract);
                    await ct.methods.approve(contract,ethers.constants.MaxUint256).send({ from : account})
                    // await onApprove(token.contract); // approve
                    pendings = pendingTxs;
                    pendings[index] = false;
                    setPendingTxs(pendings);
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
        noHeader
        noMax
      />

        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20, paddingTop : 10}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center'}}>To mint {val} {name} you have to provide these amount of tokens</Text>
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

export default MintModal
