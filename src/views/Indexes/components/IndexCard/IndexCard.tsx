import React, { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { useDispatch } from 'react-redux'
import { Tag, Flex, Heading, Text, Skeleton, Button, useModal } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {IndexToken} from 'config/constants/types'
import { useGalaxy } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'
import { fetchIndexUserData } from 'state/actions'
import { useIndexUser } from 'state/hooks'
import { galaxyTotalSupply, galaxyPrice, galaxyBalance, galaxyComponentPrices } from 'utils/callHelpers'
import { getFullDisplayBalance } from 'utils/formatBalance'
import UnlockButton from 'components/UnlockButton'
import styled, { keyframes } from 'styled-components'
import CardHeader from './CardHeader'
import MintModal from '../MintModal'



interface IndexCardProps {
    id: number
    name: string
    image: string
    creator: string
    tokens: IndexToken[]
    contract: string
    account?: string
    ethereum?: provider
    
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
  text-align: center;
`

const CardBody = styled.div`
    margin-top : 20px;
`;

const Actions = styled.div`
    margin-top : 25px;
`


const IndexCard: React.FC<IndexCardProps> = (indexProps) => {
    const { tokens, contract, name, account, ethereum, id } = indexProps;
    const tokenNames = tokens.map(x => x.name);
    const indexContract = useGalaxy(contract);
    const xxx = useIndexUser(id)
    console.log('index from state')
    console.log(xxx)
    const dispatch = useDispatch()
    const { fastRefresh } = useRefresh()

    useEffect(() => {
        if (account) {
          dispatch(fetchIndexUserData(account))
        }
    }, [account, dispatch, fastRefresh])

    const [supply, setSupply] = useState(new BigNumber(0));
    const [price, setPrice] = useState(new BigNumber(0));
    const [balance, setBalance] = useState(new BigNumber(0));
    const [tokenPrices, setTokenPrices] = useState(Array(tokens.length).fill(new BigNumber(0)))
    const [totalPrice, setTotalPrices] = useState(new BigNumber(0))

    const [onPresentMint] = useModal(<MintModal tokens={tokens} contract={contract} name={name} account={account} ethereum={ethereum} onConfirm={(x : string) => {console.log('confirm')}}/>)

    const getSupply =  useEffect(() => {
        async function fetchTotalSupply() {
            const _supply = await galaxyTotalSupply(indexContract);
            setSupply(new BigNumber(_supply).dividedBy(new BigNumber(10).pow(18)))
        }
        fetchTotalSupply()
    }, [indexContract])

    const getIndexPrice = useEffect(() => {
        async function fetchPrice() {
            try {
                const _price = await galaxyPrice(indexContract, '0.000001');
                setPrice(new BigNumber(_price).times(1000000).dividedBy(new BigNumber(10).pow(18))); // fix for visual usd 
            } catch (ex) {
                console.error(ex)
            }
        }
        fetchPrice()
    }, [indexContract])

    const getUserBalance = useEffect(() => {
        async function fetchBalance() {
            try {
                if(account) {
                    const _balance = await galaxyBalance(indexContract, account);
                    setBalance(new BigNumber(_balance));
                }
            } catch (ex) {
                console.error(ex)
            }
        }
        fetchBalance()
    },[indexContract, account])

    const getComponentPrices = useEffect(() => {
        async function getPrices() {
            try {
                const _prices = await galaxyComponentPrices(indexContract, '0.000001');
                const tokenPriceList = []
                let totalTokenPrice = new BigNumber(0);
                for(let i = 0; i < tokens.length; i++) {
                    tokenPriceList[i] = new BigNumber(_prices[i].amount).times(1000000).dividedBy(new BigNumber(10).pow(18));
                    totalTokenPrice = totalTokenPrice.plus(new BigNumber(_prices[i].amount).times(1000000).dividedBy(new BigNumber(10).pow(18))) 
                }

                console.log(totalTokenPrice.toString())
                setTokenPrices(tokenPriceList);
                setTotalPrices(totalTokenPrice);
            } catch (ex) {
                console.error(ex)
            }
        }
        getPrices()
    },[indexContract, tokens])
    return (
        <ICard>
            <CardHeader 
                name= {indexProps.name}
                image= {indexProps.image}
                tokens={tokenNames}
            />
            <CardBody>
                <Heading size="xs" style={{ alignItems: 'flex-start' }}>
                    Tokens
                </Heading>
                <Flex alignItems='center' justifyContent='space-between'>
                            <Text bold  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>Token Name</Text>
                            <Text bold  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>% Amount</Text>
                </Flex>
                    {tokens.map((token,index) => (
                        <Flex alignItems='center' justifyContent='space-between'>
                            <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>{token.name} :</Text>
                            <Flex>
                               <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>% {tokenPrices[index].dividedBy(new BigNumber(totalPrice)).times(100).toFixed(2)}</Text>
                            </Flex>
                        </Flex>
                    ))}
            </CardBody>
            <CardBody>
                <Flex alignItems='center' justifyContent='space-between'>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Total Supply : </Text>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{supply.toString()}</Text>
                </Flex>
                <Flex alignItems='center' justifyContent='space-between'>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>BUSD Price : </Text>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>{price.toString()} $</Text>
                </Flex>
            </CardBody>
            <Actions>
                {account ? (<>
                <Flex alignItems='center' justifyContent='space-between'>
                    <Button variant='success' onClick={onPresentMint}>Mint</Button>
                    <Button variant='danger'>Burn</Button>
                </Flex>
                <Flex style={{marginTop : '20px'}} alignItems='center' justifyContent='space-between'>
                    <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>Your Balance : </Text>
                    <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>{balance.toString()} </Text>
                </Flex>
                </>
                ) : ( <UnlockButton fullWidth /> )}

            </Actions>
        </ICard>
    )
}

export default IndexCard;