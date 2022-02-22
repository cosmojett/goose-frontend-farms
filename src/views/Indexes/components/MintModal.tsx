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
import { useIndexComponentBalances, useIndexMintAmounts } from 'hooks/useIndexes'
import { useApproveAddress, useApproveAddressNoContract } from 'hooks/useApprove'
import useRefresh from 'hooks/useRefresh'
import { getAllowanceForAddress, getTokenBalance, getContract } from 'utils/erc20'
import { IndexToken } from 'config/constants/types'
import { getFullDisplayBalance, getFullDisplayBalanceFixed } from 'utils/formatBalance'
import { result } from 'lodash'

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
    const mintAmounts = useIndexMintAmounts(contract)
    const w3 = useWeb3()

    const getTokenNameFromContract = function(addr: string) {
      const resultx = tokens.filter((x) => x.contract[process.env.REACT_APP_CHAIN_ID] === addr);
      if(resultx.length > 0) {
          return resultx[0].name;
      }
      return '';
  }
    // const { onApprove } = useApproveAddressNoContract(contract)

    const tokenBalances = useIndexComponentBalances(account, tokens.map((token) => token.contract[process.env.REACT_APP_CHAIN_ID]), contract)

  const isBalanceEnough = function(v: number) {
    if(tokenBalances.length === mintAmounts.length && tokenBalances.length > 0) {

      return mintAmounts.filter((token, index) => new BigNumber(token.amount).times(v).isLessThanOrEqualTo(tokenBalances[index].balance) && token.token === tokenBalances[index].contract).length === mintAmounts.length;

    } 
    return false;

  }

  const isTokenBalanceEnough = function(i: number, v:number) {
    if(tokenBalances.length === mintAmounts.length && tokenBalances.length > 0) {
      return new BigNumber(mintAmounts[i].amount).times(v).isLessThanOrEqualTo(tokenBalances[i].balance)
    } 
    return false;
  }

  const handleChange = useCallback(
    async (e: React.FormEvent<HTMLInputElement>) => {
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
        {tokenBalances.map((token,index) => (

        <Flex alignItems='center' justifyContent='space-between' style={{paddingTop : 5, paddingBottom :10}}>
                  {
                  console.log(token.contract, contract, account)
                  }
            <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{getFullDisplayBalanceFixed(token.balance,18,8)} {tokens[index].name } </Text>
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
        {mintAmounts.map((token,index) => (
        <Flex alignItems='center' justifyContent='center' style={{paddingTop : 5, paddingBottom : 5}}>
            <Text  fontSize="16px" bold style={ isTokenBalanceEnough(index, Number(val)) ? { display: 'flex', alignItems: 'center'} : { display: 'flex', alignItems: 'center', color:'red'}}> { token ? getFullDisplayBalanceFixed(new BigNumber(token.amount).times(Number(val)),18,8) : new BigNumber(0).toString()} {getTokenNameFromContract(token.token)}</Text>
        </Flex>
        ))}

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !isBalanceEnough(Number(val))}
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
