import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading } from '@pancakeswap-libs/uikit'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImage?: string
  tokenSymbol?: string
  image?: string
  earnToken?: string
}


const Wrapper = styled(Flex)`
    justify-content : center;
    align-items : center;
`

const Background = styled(Flex)`
    background-size: auto;
    border-radius : 6px;
    height : 100px;
    width : 100%;
    display: flex;
    flex-direction : column;
    align-items : center;
    justify-content : center;
    text-align : center;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`
// mobilde header text küçült

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImage,
  tokenSymbol,
  depositFee,
  image,
  earnToken
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Background style={{backgroundImage : `url(${image})`}}>
                <Heading as="h1" size="xl"  color="contrast" style={{ textAlign: 'center' }}>
                    {lpLabel}
                </Heading>
                <Heading as="h2" size="md"  color="contrast" style={{ textAlign: 'center' }}>
                  Earn {earnToken}
                </Heading>
      </Background>
    </Wrapper>
  )
}

export default CardHeading
