import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import indexes from 'config/constants/indexes'
import FlexLayout from 'components/layout/Flex'
import Divider from './components/Divider'
import IndexCard from './components/IndexCard/IndexCard'


const Indexes: React.FC = () => {
    
    return (
        <Page>
            <Heading as="h1" size="lg" mb="24px" color="primary" style={{ textAlign: 'center' }}>
                Indexes by Aerospace Finance
            </Heading>
            <Heading as="h2" color="contrast" mb="50px" style={{ textAlign: 'center' }}>
                Join to indexes & start earning by simply one click.
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
                    />
                ))}
            </FlexLayout>
        </Page>
    )
}

export default Indexes