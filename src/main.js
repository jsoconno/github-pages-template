import Vue from 'vue'
import App from './App'
import router from './router'
import VueTreeNavigation from 'vue-tree-navigation'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// All icons can be found here: https://fontawesome.com/search?m=free&o=r
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

Vue.use(VueTreeNavigation)

for (const icon in far) {
  library.add(far[icon])
}
library.add(fas)

const filter = (text, length, clamp) => {
  clamp = clamp || '...'
  var node = document.createElement('div')
  node.innerHTML = text
  var content = node.textContent
  return content.length > length ? content.slice(0, length) + clamp : content
}

Vue.filter('truncate', filter)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
