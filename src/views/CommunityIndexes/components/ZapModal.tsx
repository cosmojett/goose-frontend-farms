import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { provider } from 'web3-core'
import { ethers } from 'ethers'
import { AbiItem } from 'web3-utils'
import { Button, Modal, Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import ZapInput from 'components/ZapInput'
import ERC20 from 'config/abi/erc20.json'
import useI18n from 'hooks/useI18n'
import { useGalaxy } from 'hooks/useContract'
import { galaxyComponentAmounts, approveToAddress } from 'utils/callHelpers'
import { useApproveAddress } from 'hooks/useApprove'
import { useIndexMintFee, useIndexZapAllowance, useIndexSlippage } from 'hooks/useIndexes'
import { getAllowanceForAddress, getTokenBalance } from 'utils/erc20'
import { getContract } from 'utils/web3'
import useWeb3 from 'hooks/useWeb3'
import { IndexToken } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface ZapModalProps {
    tokens: IndexToken[]
    contract: string
    name: string
    onDismiss?: () => void
    onConfirm: (amount: string) => void
    onApprove: (spender: string) => void
    account?: string
    ethereum?: provider
    balance? : BigNumber
    zap: IndexToken
    lotPrice : BigNumber
    minAmount: BigNumber
}

const ZapModal: React.FC<ZapModalProps> = ({ tokens, contract, name, onDismiss, onConfirm, onApprove, ethereum, account, balance, zap, lotPrice, minAmount}) => {
  const [val, setVal] = useState('')
      const w3 = useWeb3()
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const [bnValue, setBnValue] = useState(new BigNumber(0))
  const mintFee = useIndexMintFee(contract);
  const slippage = useIndexSlippage(contract);
  const zapAllowance = useIndexZapAllowance(contract,account,zap.contract[process.env.REACT_APP_CHAIN_ID])
  const stableContract = getContract(ERC20,zap.contract[process.env.REACT_APP_CHAIN_ID])
  console.log(`Current account : ${account}`)

  const handleChange = useCallback(
    async (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value.replace(',','.'))
      setBnValue(new BigNumber(e.currentTarget.value.replace(',','.')))

    },
    [setVal, setBnValue],
  )

  const handleSelectMax = useCallback(async () => {
    setVal(new BigNumber(balance).dividedBy(lotPrice).times(0.99).toFixed(8))
    setBnValue(new BigNumber(balance).dividedBy(lotPrice).times(0.99))

  }, [balance, setVal, lotPrice, setBnValue])

  return (
    <Modal title={`Zap ${zap.name} to get ${name}`} onDismiss={onDismiss}>
       
      <ZapInput
        onSelectMax={handleSelectMax}
        value={val}
        onChange={handleChange}
        max={getFullDisplayBalance(balance)}
        symbol={zap.name}
        targetSymbol={name}
        lotPrice={lotPrice}
      />
      {
        console.log(bnValue.toString())
      }
        <Flex alignItems='center' justifyContent='center' style={{ paddingBottom : 20, paddingTop : 10}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>You will pay {!bnValue.isNaN() ? bnValue.times(lotPrice.dividedBy(new BigNumber(10).pow(18))).times(slippage.dividedBy(10000).plus(1)).toFixed(6) : ''} {zap.name} to get {val} amount of {name}.</Text>
        </Flex>
        <Flex flexDirection='column' alignItems='center' justifyContent='center' style={{ paddingBottom : 20, paddingTop : 10}}>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>There will be {slippage.dividedBy(100).toString()}% slippage. </Text>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>Minimum amount you can buy is {minAmount.dividedBy(new BigNumber(10).pow(18)).toString()}</Text>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>The BUSD amount can be different than shown above because of component price difference. </Text>
            <Text  fontSize="12px" bold style={{ display: 'flex', alignItems: 'center', wordWrap : 'break-word'}}>There will be {mintFee / 100}% minting fee applied. These fees will be used to buy-back BUZZ.</Text>
            
        </Flex>

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        {zapAllowance.isGreaterThan(0) ? 
        (        
        <Button
          disabled={pendingTx || new BigNumber(val).isGreaterThan(getFullDisplayBalance(balance)) || new BigNumber(val).times(new BigNumber(10).pow(18)).isLessThan(minAmount)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val.replace(',','.'))
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>) : (         
        <Button
          disabled={pendingTx || new BigNumber(val).isGreaterThan(getFullDisplayBalance(balance))}
          onClick={async () => {
            setPendingTx(true)
            const ct = new w3.eth.Contract((ERC20 as unknown) as AbiItem,zap.contract[process.env.REACT_APP_CHAIN_ID]);
            await ct.methods.approve(contract,ethers.constants.MaxUint256).send({ from : account})
            setPendingTx(false)
          }}
        >
          {pendingTx ? 'Pending Confirmation' : 'Approve'}
        </Button>)}
      </ModalActions>
    </Modal>
  )
}

export default ZapModal
