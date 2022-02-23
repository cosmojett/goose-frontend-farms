import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Heading, Text, BaseLayout } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import Page from 'components/layout/Page'
import useRefresh from 'hooks/useRefresh'
import { fetchIndexUserData } from 'state/actions'
import indexes from 'config/constants/indexes'
import FlexLayout from 'components/layout/Flex'
import Divider from './components/Divider'
import IndexCard from './components/IndexCard/IndexCard'


const Indexes: React.FC = () => {
      const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

      const dispatch = useDispatch()
      const { fastRefresh } = useRefresh()
/*
      useEffect(() => {
        if (account) {
          dispatch(fetchIndexUserData(account))
        }
    }, [account, dispatch, fastRefresh]) */
    return (
        <Page>
            <Heading as="h1" size="lg" mb="24px" color="primary" style={{ textAlign: 'center' }}>
                Galaxies by Cosmosium Finance
            </Heading>
            <Heading as="h2" color="contrast" mb="50px" style={{ textAlign: 'center' }}>
                Galaxies are currently on Beta Stage. Development still in progress.
            </Heading>
            <Divider />
            <FlexLayout>
            {indexes.map(i => (
                    <IndexCard 
                        id={i.id}
                        name= {i.name}
                        image= {i.image}
                        creator= {i.creator}
                        tokens= {i.tokens}
                        contract= {i.contract}
                        ethereum={ethereum}
                        account={account}
                        zap={i.zap}
                    />
                ))}
            </FlexLayout>
        </Page>
    )
}

export default Indexes