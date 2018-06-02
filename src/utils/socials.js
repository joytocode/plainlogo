import allNetworks from 'vue-social-sharing/src/networks.json'

const excludedNetworkIds = ['pinterest']

const knownNetworks = [
  { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook' },
  { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' },
  { id: 'googleplus', name: 'Google Plus', icon: 'fab fa-google-plus' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin' },
  { id: 'email', name: 'Email', icon: 'far fa-envelope' },
  { id: 'sms', name: 'SMS', icon: 'far fa-comment' },
  { id: 'reddit', name: 'Reddit', icon: 'fab fa-reddit' },
  { id: 'viber', name: 'Viber', icon: 'fab fa-viber' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp' },
  { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram' },
  { id: 'line', name: 'Line', icon: 'fab fa-line' },
  { id: 'skype', name: 'Skype', icon: 'fab fa-skype' },
  { id: 'weibo', name: 'Weibo', icon: 'fab fa-weibo' },
  { id: 'vk', name: 'Vk', icon: 'fab fa-vk' },
  { id: 'odnoklassniki', name: 'Odnoklassniki', icon: 'fab fa-odnoklassniki' }
]

const knownNetworkIds = knownNetworks.map(({ id }) => id)
const otherNetworks = Object.keys(allNetworks)
  .filter((networkId) => !excludedNetworkIds.includes(networkId))
  .filter((networkId) => !knownNetworkIds.includes(networkId))
  .map((networkId) => ({ id: networkId, name: networkId.toUpperCase(), icon: 'fas fa-share-alt' }))
const sortedNetworks = knownNetworks.concat(otherNetworks)

export default sortedNetworks
