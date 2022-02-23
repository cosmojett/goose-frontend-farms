import React, { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { Tag, Flex, Heading, Text, Skeleton, Button, useModal } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {IndexToken} from 'config/constants/types'
import { useGalaxy } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'
import ERC20 from 'config/abi/erc20.json'
import { getBalanceNumber, getFullDisplayBalance, getFullDisplayBalanceFixed } from 'utils/formatBalance'
import { fetchIndexUserData } from 'state/actions'
import { useGalaxyMint } from 'hooks/useStake'
import { useGalaxyBurn } from 'hooks/useUnstake'
import { useApproveAddressNoFarm, useApproveAddressNoContract } from 'hooks/useApprove'
import { getContract } from 'utils/web3'
import useTokenBalance from 'hooks/useTokenBalance'
import { useIndexUser } from 'state/hooks'
import { galaxyTotalSupply, galaxyPrice, galaxyBalance, galaxyComponentPrices } from 'utils/callHelpers'
import { useIndexBalance, useIndexSupply, useIndexPrice, useIndexComponentPrices, useIndexZap } from 'hooks/useIndexes'
import UnlockButton from 'components/UnlockButton'
import styled, { keyframes } from 'styled-components'
import CardHeader from './CardHeader'
import MintModal from '../MintModal'
import BurnModal from '../BurnModal'
import ZapModal from '../ZapModal'

interface IndexCardProps {
    id: number
    name: string
    image: string
    creator: string
    tokens: IndexToken[]
    contract: string
    account?: string
    ethereum?: provider
    zap: IndexToken
    
}

const ICard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  min-height: 500px;
  text-align: center;
`

const CardBody = styled.div`
    margin-top : 10px;
`;

const Actions = styled.div`
    margin-top : 25px;
`

const Divider = styled.div`
background-color: ${({ theme }) => theme.colors.textSubtle};
height: 1px;
margin: 8px auto 8px;
width: 100%;
`


const IndexCard: React.FC<IndexCardProps> = (indexProps) => {
    const { tokens, contract, name, account, ethereum, id, zap } = indexProps;
    const tokenNames = tokens.map(x => x.name);
    const userBalance = useIndexBalance(contract, account)
    console.log(name)
    console.log(tokens)
    const totalSupply = useIndexSupply(contract);
    const userZapBalance = useTokenBalance(zap.contract[process.env.REACT_APP_CHAIN_ID])
    const price = useIndexPrice(contract);
    const components = useIndexComponentPrices(contract);
    const totalPrice = components.length > 0 ? components.reduce((a, b) => ({price: a.price.plus(b.price), token :''})) : {price : new BigNumber(0), token : ''};
    // const [totalPrice, setTotalPrices] = useState(new BigNumber(0))
    const { onMint } = useGalaxyMint(contract)
    const { onBurn } = useGalaxyBurn(contract)
    const { onZap } = useIndexZap(contract)

    const { onApproveAddress } = useApproveAddressNoContract(contract)

    const [onPresentMint] = useModal(<MintModal tokens={tokens} contract={contract} name={name} account={account} ethereum={ethereum} onConfirm={onMint} onApprove={onApproveAddress}/>)
    const [onPresentBurn] = useModal(<BurnModal balance={userBalance} tokens={tokens} contract={contract} name={name} account={account} ethereum={ethereum} onConfirm={onBurn}/>)
    const [onPresentZap] = useModal(<ZapModal lotPrice={price} zap={zap} balance={userZapBalance} tokens={tokens} contract={contract} name={name} account={account} ethereum={ethereum} onConfirm={onZap} onApprove={onApproveAddress}/>)

    const getTokenNameFromContract = function(addr: string) {
        const result = tokens.filter((x) => x.contract[process.env.REACT_APP_CHAIN_ID] === addr);
        if(result.length > 0) {
            return result[0].name;
        }
        return '';
    }

    return (
        <ICard>
            <CardHeader 
                name= {indexProps.name}
                image= {indexProps.image}
                tokens={tokenNames}
            />
            <CardBody>

                <Flex alignItems='center' justifyContent='space-between'>
                            <Text bold  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>Token Name</Text>
                            <Text bold  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>% USD</Text>
                </Flex>
                <Divider />
                    {components.map((token,index) => (
                        <Flex alignItems='center' justifyContent='space-between'>
                            <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>{getTokenNameFromContract(token.token)} :</Text>
                            <Flex>
                               <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>% {token.price.dividedBy(new BigNumber(totalPrice.price)).times(100).toFixed(2)}</Text>
                            </Flex>
                        </Flex>
                    ))}
            </CardBody>
            <Divider />
            <CardBody>
                <Flex alignItems='center' justifyContent='space-between'>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Total Supply : </Text>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{getFullDisplayBalance(totalSupply)}</Text>
                </Flex>
                <Flex alignItems='center' justifyContent='space-between'>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Unit Price : </Text>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{getFullDisplayBalanceFixed(price,18,3)} $</Text>
                </Flex>
            </CardBody>
            <Actions>
                {account ? (<>
                <Flex alignItems='center' justifyContent='space-between'>
                    <Button variant='success' size='sm' onClick={onPresentMint}>Mint</Button>
                    <Button variant='success' size='sm' onClick={onPresentZap}>Zap</Button>
                    <Button variant='danger'  size='sm' onClick={onPresentBurn}>Burn</Button>
                </Flex>
                <Flex style={{marginTop : '20px'}} alignItems='center' justifyContent='space-between'>
                    <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>Your Balance : </Text>
                    <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>{account ? getBalanceNumber(userBalance) : getBalanceNumber(new BigNumber(0))} </Text>
                </Flex>
                </>
                ) : ( <UnlockButton fullWidth /> )}

            </Actions>
        </ICard>
    )
}

export default IndexCard;