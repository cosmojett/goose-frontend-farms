import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://dex.cosmosium.finance/',
      },
      {
        label: 'Liquidity',
        href: 'https://dex.cosmosium.finance/#/pool',
      },
    ],
  },
  {
    label: 'Earn',
    icon: 'FarmIcon',
    items : [
      {
        label: 'Clusters',
        href: '/clusters',
      },
      {
        label: 'Farms',
        href: '/farms',
      },
    ]
  },
  {
    label: 'Indexes',
    icon: 'PoolIcon',
    href: '/indexes',
  },
  // {
  //  label: 'Options',
  //  icon: 'FarmIcon',
  //  items : [
  //    {
  //      label: 'Call',
  //      href: '/options/call',
  //    },
  //    {
  //      label: 'Put',
  //      href: '/options/put',
  //    },
  //  ]
  // }, 
  {
    label: 'IFO',
    icon: 'PoolIcon',
    href: '/ifo',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  {
    label: 'Links',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/cosmosiumfinance/',
      },
      {
        label: 'Docs',
        href: 'https://docs.cosmosium.finance/',
      },
      {
        label: 'Blog',
        href: 'https://medium.com/@cosmosiumfinance/',
      },
    ],
  },
]

export default config
