import contract from './contracts'
import { Indexes } from './types'

const indexes: Indexes[] = [/*
    {
        id: 0,
        name: 'Large Cap Index',
        image : './images/indexes/1.jpg',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.btcb,
                name : 'BTCB'
            },
            {
                contract : contract.ethb,
                name : 'ETHB'
            },
        ],
        contract: '0xDe12f8faC90a56CD6D2426d2c675aCD8e34b1435'
    }, */
    {
        id: 0,
        name: 'Large Cap Index',
        image : './images/indexes/2.jpg',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.btcb,
                name : 'BTC'
            },
            {
                contract : contract.ethb,
                name : 'ETH'
            },
            {
                contract : contract.wbnb,
                name : 'WBNB'
            },
            {
                contract : contract.buzz,
                name : 'BUZZ'
            }
        ],
        contract: '0xAF932A3fAB0876cAD845C1BBf08E04dA00E665CF',
        zap : {
            contract : contract.busd,
            name : 'BUSD'
        }
    }, 
]

export default indexes;