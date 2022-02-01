import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { Tag, Flex, Heading, Text, Skeleton, Button } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {IndexToken} from 'config/constants/types'
import UnlockButton from 'components/UnlockButton'
import styled, { keyframes } from 'styled-components'
import CardHeader from './CardHeader'


interface IndexCardProps {
    id: number
    name: string
    image: string
    creator: string
    tokens: IndexToken[]
    contract: string
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
    const { tokens } = indexProps;
    const tokenNames = tokens.map(x => x.name);
    const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
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
                    {tokens.map(token => (
                        <Flex alignItems='center' justifyContent='space-between'>
                            <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>{token.name} :</Text>
                            <Flex>
                                <Skeleton height={16} width={80} />
                            </Flex>
                        </Flex>
                    ))}
            </CardBody>
            <CardBody>
                <Flex alignItems='center' justifyContent='space-between'>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>Total Supply : </Text>
                        <Skeleton height={16} width={80} />
                </Flex>
                <Flex alignItems='center' justifyContent='space-between'>
                        <Text  fontSize="16px" bold style={{ display: 'flex', alignItems: 'center'}}>USD Price : </Text>
                        <Skeleton height={16} width={80} />
                </Flex>
            </CardBody>
            <Actions>
                {account ? (<>
                <Flex alignItems='center' justifyContent='space-between'>
                    <Button variant='success'>Mint</Button>
                    <Button variant='danger'>Burn</Button>
                </Flex>
                <Flex style={{marginTop : '20px'}} alignItems='center' justifyContent='space-between'>
                    <Text  fontSize="16px" style={{ display: 'flex', alignItems: 'center'}}>Your Balance : </Text>
                    <Skeleton height={16} width={80} />
                </Flex>
                </>
                ) : ( <UnlockButton fullWidth /> )}

            </Actions>
        </ICard>
    )
}

export default IndexCard;