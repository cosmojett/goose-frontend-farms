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


const ManageIndex: React.FC = () => {
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
                Create your own Galaxy
            </Heading>
            <Heading as="h2" color="contrast" mb="50px" style={{ textAlign: 'center' }}>
                You can create your own Galaxy on this page and share this index with community.
            </Heading>
            <Divider />
        </Page>
    )
}

export default ManageIndex