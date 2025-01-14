import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid : 0,
    risk : 5,
    lpSymbol : 'Cosmic Farm #1',
    lpAddresses : {
      97 : '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56 : '0xa73c15620bfa79646e9a11d0d638d66588456462'
    },
    tokenSymbol : 'BUZZ',
    tokenAddresses: {
      97: '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56: '0xa73c15620bfa79646e9a11d0d638d66588456462',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/1.jpg',
    earnToken : 'BUZZ',
    depositToken : 'BUZZ',
    isTokenOnly : true,
    isAuto : true,
    isCluster : false,
    autoFarmContract : {
      97 : '0x53356bA80bc3986C777B5CaB15573830d8E832ed',
      56 : '0x79eFe3cC2E2291D9570762d0a6b8Cf00B9d593df'
    }
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'BUZZ-BNB APE-LP',
    lpAddresses: {
      97: '0x88C8E3bc6a3Ee7967dE12ed01046d4743ab00002',
      56: '0xac67c5108816e5dab31376a0ee916d1fa7e6d50a',
    },
    tokenSymbol: 'BUZZ',
    tokenAddresses: {
      97: '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56: '0xa73c15620bfa79646e9a11d0d638d66588456462',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    image : './images/indexes/7.jpg',
    earnToken : 'BUZZ',
    depositToken : 'BUZZ-BNB APE-LP',
    isAuto : false,
    isCluster : false,
    isLpFarm : true,
  },  
  {
    pid: 2,
    risk: 5,
    lpSymbol: 'Cluster #1',
    lpAddresses: {
      97: '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56: '0xa73c15620bfa79646e9a11d0d638d66588456462',
    },
    tokenSymbol: 'BUZZ',
    tokenAddresses: {
      97: '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56: '0xa73c15620bfa79646e9a11d0d638d66588456462',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/2.jpg',
    earnToken : 'BUZZ',
    depositToken : 'BUZZ',
    isAuto : false,
    isCluster : true,
    isTokenOnly : true,
    clusterContract : {
      97 : '0x83aFb309b4C8891F1fA04A61c77bcCD882eE6134',
      56 : '0x1770104aa9b1BDB1D1582802b3221a466A2A4f4d'
    }
  },
  {
    pid: 3,
    risk: 5,
    lpSymbol: 'Cluster #2',
    lpAddresses: {
      97: '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56: '0xa73c15620bfa79646e9a11d0d638d66588456462',
    },
    tokenSymbol: 'BUZZ',
    tokenAddresses: {
      97: '0x9F861a8aCa106A3b3A12385eAE76784885D51239',
      56: '0xa73c15620bfa79646e9a11d0d638d66588456462',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/3.jpg',
    earnToken : 'BUZZ',
    depositToken : 'BUZZ',
    isTokenOnly : true,
    isAuto : false,
    isCluster : true,
    clusterContract : {
      97 : '',
      56 : '0x027c055560F176A60206B592583927a4DE913FEF'
    }
  },
  {
    pid: 4,
    risk: 5,
    lpSymbol: 'BNB-BUSD APE-LP',
    lpAddresses: {
      97: '',
      56: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93',
    },
    tokenSymbol: 'BNB',
    tokenAddresses: {
      97: '',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/6.jpg',
    earnToken : 'BUZZ',
    depositToken : 'BNB-BUSD APE-LP',
    isAuto : false,
    isCluster : false,
    isLpFarm : true,
  },  
  {
    pid: 5,
    risk: 5,
    lpSymbol: 'Bitcoin',
    isTokenOnly : true,
    lpAddresses: {
      97: '',
      56: '0xf45cd219aef8618a92baa7ad848364a158a24f33',
    },
    tokenSymbol: 'BTC',
    tokenAddresses: {
      97: '',
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/5.jpg',
    earnToken : 'BUZZ',
    depositToken : 'BTC',
    isAuto : false,
    isCluster : false,
    isLpFarm : false,
    tokenBuyLink : 'https://dex.cosmosium.finance/#/swap?outputCurrency=0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'
  },
  {
    pid: 6,
    risk: 5,
    lpSymbol: 'CAKE',
    isTokenOnly : true,
    lpAddresses: {
      97: '',
      56: '0x804678fa97d91b974ec2af3c843270886528a9e6',
    },
    tokenSymbol: 'CAKE',
    tokenAddresses: {
      97: '',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/8.jpg',
    earnToken : 'BUZZ',
    depositToken : 'CAKE',
    isAuto : false,
    isCluster : false,
    isLpFarm : false,
    tokenBuyLink : 'https://dex.cosmosium.finance/#/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
  },
  {
    pid: 7,
    risk: 5,
    isTokenOnly : true,
    lpSymbol: 'ETH',
    lpAddresses: {
      97: '',
      56: '0x7213a321f1855cf1779f42c0cd85d3d95291d34c',
    },
    tokenSymbol: 'ETH',
    tokenAddresses: {
      97: '',
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/indexes/9.png',
    earnToken : 'BUZZ',
    depositToken : 'ETH',
    isAuto : false,
    isCluster : false,
    isLpFarm : false,
    tokenBuyLink : 'https://dex.cosmosium.finance/#/swap?outputCurrency=0x2170ed0880ac9a755fd29b2688956bd959f933f8'
  },
  {
    pid: 8,
    risk: 5,
    lpSymbol: 'USDT',
    isTokenOnly : true,
    lpAddresses: {
      97: '',
      56: '0x7efaef62fddcca950418312c6c91aef321375a00',
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      97: '',
      56: '0x55d398326f99059fF775485246999027B3197955',
    },
    quoteTokenSymbol: QuoteToken.USDT,
    quoteTokenAdresses: contracts.usdt,
    image : './images/indexes/10.jpg',
    earnToken : 'BUZZ',
    depositToken : 'USDT',
    isAuto : false,
    isCluster : false,
    isLpFarm : false,
    tokenBuyLink : 'https://dex.cosmosium.finance/#/swap?outputCurrency=0x55d398326f99059fF775485246999027B3197955'
  },
  /*  {
    pid: 0,
    risk: 5,
    lpSymbol: 'EGG-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x19e7cbecdd23a16dfa5573df54d98f7caae03019',
    },
    tokenSymbol: 'EGG',
    tokenAddresses: {
      97: '',
      56: '0xf952fc3ca7325cc27d15885d37117676d25bfda6',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    image : './images/farm_bg/1.png',
    earnToken : 'BUZZ'
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'EGG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd1b59d11316e87c3a0a069e80f590ba35cd8d8d3',
    },
    tokenSymbol: 'EGG',
    tokenAddresses: {
      97: '',
      56: '0xf952fc3ca7325cc27d15885d37117676d25bfda6',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    image : './images/farm_bg/2.png',
    earnToken : 'BUZZ'
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    tokenSymbol: 'BNB',
    tokenAddresses: {
      97: '',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 12,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'EGG',
    lpAddresses: {
      97: '',
      56: '0x19e7cbecdd23a16dfa5573df54d98f7caae03019', // EGG-BUSD LP
    },
    tokenSymbol: 'EGG',
    tokenAddresses: {
      97: '',
      56: '0xf952fc3ca7325cc27d15885d37117676d25bfda6',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 13,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BUSD',
    lpAddresses: {
      97: '',
      56: '0x19e7cbecdd23a16dfa5573df54d98f7caae03019', // EGG-BUSD LP (BUSD-BUSD will ignore)
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: {
      97: '',
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 14,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'WBNB',
    lpAddresses: {
      97: '',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f', // BNB-BUSD LP
    },
    tokenSymbol: 'WBNB',
    tokenAddresses: {
      97: '',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 15,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'USDT',
    lpAddresses: {
      97: '',
      56: '0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd', // USDT-BUSD LP
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      97: '',
      56: '0x55d398326f99059ff775485246999027b3197955',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 16,
    risk: 2,
    isTokenOnly: true,
    lpSymbol: 'BTCB',
    lpAddresses: {
      97: '',
      56: '0xb8875e207ee8096a929d543c9981c9586992eacb', // BTCB-BUSD LP
    },
    tokenSymbol: 'BTCB',
    tokenAddresses: {
      97: '',
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 17,
    risk: 2,
    isTokenOnly: true,
    lpSymbol: 'ETH',
    lpAddresses: {
      97: '',
      56: '0xd9a0d1f5e02de2403f68bb71a15f8847a854b494', // ETH-BUSD LP
    },
    tokenSymbol: 'ETH',
    tokenAddresses: {
      97: '',
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 18,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'DAI',
    lpAddresses: {
      97: '',
      56: '0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc', // DAI-BUSD LP
    },
    tokenSymbol: 'DAI',
    tokenAddresses: {
      97: '',
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 19,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'USDC',
    lpAddresses: {
      97: '',
      56: '0x680dd100e4b394bda26a59dd5c119a391e747d18', // USDC-BUSD LP
    },
    tokenSymbol: 'USDC',
    tokenAddresses: {
      97: '',
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 20,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'DOT',
    lpAddresses: {
      97: '',
      56: '0x54c1ec2f543966953f2f7564692606ea7d5a184e', // DOT-BUSD LP
    },
    tokenSymbol: 'DOT',
    tokenAddresses: {
      97: '',
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 21,
    risk: 4,
    isTokenOnly: true,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '',
      56: '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458', // CAKE-BUSD LP
    },
    tokenSymbol: 'CAKE',
    tokenAddresses: {
      97: '',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 22,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'BSCX',
    lpAddresses: {
      97: '',
      56: '0xa32a983a64ce21834221aa0ad1f1533907553136', // BSCX-BUSD LP
    },
    tokenSymbol: 'BSCX',
    tokenAddresses: {
      97: '',
      56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 23,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'AUTO',
    lpAddresses: {
      97: '',
      56: '0x4d0228ebeb39f6d2f29ba528e2d15fc9121ead56', // AUTO-BNB LP
    },
    tokenSymbol: 'AUTO',
    tokenAddresses: {
      97: '',
      56: '0xa184088a740c695e156f91f5cc086a06bb78b827',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  }, */
]

export default farms
