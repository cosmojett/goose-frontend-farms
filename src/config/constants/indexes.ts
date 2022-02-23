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
        image : './images/indexes/large.png',
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
        contract: '0xD6C301c6C7f304aa237b64A634e877C504f903B4',
        zap : {
            contract : contract.busd,
            name : 'BUSD'
        }
    }, 
]

export default indexes;