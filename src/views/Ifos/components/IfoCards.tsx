import styled from 'styled-components'

interface IfoCardWrapperProps {
  isSingle?: boolean
}
// add border when tabs added
// border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
const IfoCardWrapper = styled.div<IfoCardWrapperProps>`

  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  padding-bottom: 40px;
  padding-top: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: ${({ isSingle }) => `repeat(${isSingle ? 1 : 2}, 1fr)`};
  }
`

IfoCardWrapper.defaultProps = {
  isSingle: false,
}

export default IfoCardWrapper
