import { MenuEntry } from '@pancakeswap-libs/uikit'

const BASE_DEX = 'https://dex.cosmosium.finance';
export const links = [
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: `${BASE_DEX}/#/swap`,
      },
      {
        label: 'Liquidity',
        href: `${BASE_DEX}/#/pool`,
      },
    ],
  },
  {
    label: 'Earn',
    icon: 'RocketIcon',
    items : [
      {
        label : 'Cosmic',
        href : '/cosmic'
      },
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
    label: 'Galaxies',
    icon: 'GalaxyIcon',
    items : [
      {
        label : 'Protocol',
        href: '/indexes',
      },
      {
        label : 'Community',
        href: '/indexes/community'
      },
      {
        label : 'IaaS',
        href : '/indexes/iaas'
      },
      {
        label : 'Create',
        href : '/indexes/create'
      }
    ]
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
  // {
  //  label: 'IFO',
  //  icon: 'TicketIcon',
  //  href: '/ifo',
  // },
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
      {
        label: 'Telegram',
        href: 'https://t.me/cosmosiumfinance',
      },
    ],
  },
];

export const socials = [
  {
    label: "Telegram",
    icon: "TelegramIcon",
    items: [
      {
        label: "Global",
        href: "https://t.me/cosmosiumfinance",
      },
      // {
      //   label: "Bahasa Indonesia",
      //   href: "https://t.me/PancakeSwapIndonesia",
      // },
      {
        label: "Indian",
        href: "https://t.me/cosmosiumindia",
      },
      // {
      //   label: "Tiếng Việt",
      //   href: "https://t.me/PancakeSwapVN",
      // },
      {
        label: "Korean",
        href: "https://t.me/cosmosiumkorea",
      },
      // {
      //   label: "Português",
      //   href: "https://t.me/PancakeSwapPortuguese",
      // },
    ],
  },
  {
    label: "Twitter",
    icon: "TwitterIcon",
    href: "https://twitter.com/cosmosium",
  },
  {
    label: "Reddit",
    icon: "RedditIcon",
    href: "https://www.reddit.com/r/Cosmosium/",
  },
];
