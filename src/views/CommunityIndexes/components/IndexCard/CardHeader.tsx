import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@pancakeswap-libs/uikit'

export interface IndexHeaderProps {
    image? : string
    name : string
    tokens? : string[]
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

const CardHeader: React.FC<IndexHeaderProps> = (props) => {
    const { name, image, tokens } = props;
    return (
        <Wrapper>
            <Background style={{backgroundImage : `url(${image})`}}>
                <Heading as="h1" size="lg"  color="contrast" style={{ textAlign: 'center' }}>
                    {name}
                </Heading>
                <Heading as="h2" size="sm"  color="contrast" style={{ textAlign: 'center' }}>
                    {tokens.map((_name, index) => (
                        <>{_name} {index < tokens.length -1 ? '-' : ''} </>
                    ))}
                </Heading>
            </Background>
        </Wrapper>
    )
}

export default CardHeader;