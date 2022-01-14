import contract from './contracts'
import { Indexes } from './types'

const indexes: Indexes[] = [
    {
        id: 0,
        name: 'Sample Index',
        image : './images/indexes/1.jpg',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.wavax,
                name : 'WAVAX'
            },
            {
                contract : contract.wavax,
                name : 'DAI'
            }
        ],
        contract: '0x...'
    },
    {
        id: 1,
        name: 'Sample Index 2',
        image : './images/indexes/2.jpg',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.wavax,
                name : 'WAVAX'
            },
            {
                contract : contract.wavax,
                name : 'BTC-B'
            }
        ],
        contract: '0x...'
    },
    {
        id: 1,
        name: 'Sample Index 3',
        image : './images/indexes/3.jpg',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.wavax,
                name : 'WAVAX'
            }
        ],
        contract: '0x...'
    },
    {
        id: 1,
        name: 'Sample Index 4',
        image : './images/indexes/4.jpg',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.wavax,
                name : 'WAVAX'
            }
        ],
        contract: '0x...'
    }
]

export default indexes;