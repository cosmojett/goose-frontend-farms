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
        contract: '0xE80a55dE13c97D4EF80D41782874eFB0ad6474a0',
        zap : {
            contract : contract.busd,
            name : 'BUSD'
        }
    }, 
    {
        id: 1,
        name: 'DeFi Index',
        image : './images/indexes/defi.png',
        creator: 'Verified Astronauts',
        tokens: [
            {
                contract : contract.banana,
                name : 'BANANA'
            },
            {
                contract : contract.realCake,
                name : 'CAKE'
            },
            {
                contract : contract.buzz,
                name : 'BUZZ'
            }
        ],
        contract: '0x3319B3a2809bc6901E5D5534Bc296b4d6C3D5EAC',
        zap : {
            contract : contract.busd,
            name : 'BUSD'
        }
    }, 
    {
        id : 2,
        name : 'Sample Community Index',
        image : './images/indexes/defi.png',
        creator : 'Cosmo Jett',
        tokens: [
            {
                contract : contract.banana,
                name : 'BANANA'
            },
            {
                contract : contract.realCake,
                name : 'CAKE'
            },
            {
                contract : contract.buzz,
                name : 'BUZZ'
            }
        ],
        contract: '0x3319B3a2809bc6901E5D5534Bc296b4d6C3D5EAC',
        zap : {
            contract : contract.busd,
            name : 'BUSD'
        },
        isCommunity : true
    }
]

export default indexes;