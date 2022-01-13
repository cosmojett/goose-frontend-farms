import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://dex.aerospace.finance/',
      },
      {
        label: 'Liquidity',
        href: 'https://dex.aerospace.finance/#/pool',
      },
    ],
  },
  {
    label: 'Earn',
    icon: 'FarmIcon',
    items : [
      {
        label: 'Stake',
        href: '/pools',
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
    href: '/nests',
  },
  {
    label: 'Options',
    icon: 'FarmIcon',
    items : [
      {
        label: 'Call',
        href: '/options/call',
      },
      {
        label: 'Put',
        href: '/options/put',
      },
    ]
  },
  {
    label: 'Zap',
    icon: 'PoolIcon',
    href: '/zap',
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
        href: 'https://github.com/aerospacefinance/',
      },
      {
        label: 'Docs',
        href: 'https://docs.aerospace.finance/',
      },
      {
        label: 'Blog',
        href: 'https://medium.com/@aerosfinance/',
      },
    ],
  },
]

export default config
