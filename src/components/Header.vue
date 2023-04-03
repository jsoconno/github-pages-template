<template>
  <header class="header">
    <div class="header__brand">
      <svg
        ref="nav__open"
        tabindex="0"
        @keyup.enter="openNavigation"
        @click="openNavigation"
        class="header__hamburger" 
        viewBox="0 0 512 512" 
        xmlns="http://www.w3.org/2000/svg">
        <path d="M424 394H89a8 8 0 0 1 0-16h335a8 8 0 0 1 0 16zM424 265H89a8 8 0 0 1 0-16h335a8 8 0 0 1 0 16zM424 135H89a8 8 0 0 1 0-16h335a8 8 0 0 1 0 16z"/>
      </svg>
      <span class="header__name">{{ name }} <b>Documentation</b></span>
    </div>
    <div class="nav__search">
      <input class="nav__search-input" placeholder="Type to search..." v-model="searchKeywords" @keyup="search"/>
      <svg v-if="searchResultsVisible" class="nav__search-icon" tabindex="0" 
        @click="reset" 
        @keyup.enter="reset" 
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path d="M26 0C11.664 0 0 11.663 0 26s11.664 26 26 26 26-11.663 26-26S40.336 0 26 0zm0 50C12.767 50 2 39.233 2 26S12.767 2 26 2s24 10.767 24 24-10.767 24-24 24z"/><path d="M35.707 16.293a.999.999 0 0 0-1.414 0L26 24.586l-8.293-8.293a.999.999 0 1 0-1.414 1.414L24.586 26l-8.293 8.293a.999.999 0 1 0 1.414 1.414L26 27.414l8.293 8.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L27.414 26l8.293-8.293a.999.999 0 0 0 0-1.414z"/></svg>
    </div>
  </header>
</template>

<script>
import ConfigManager from '../services/configManager'

export default {
  name: 'header-component',
  data () {
    return {
      isVisible: false,
      isDesktop: false,
      name: ConfigManager.getBaseConfig().appName,
      list: ConfigManager.getBaseConfig().headerNavigation,
      content: [],
      searchKeywords: '',
      searchResultsVisible: false,
      searchResults: []
    }
  },
  created () {
    ConfigManager.getStatus()
      .then((data) => {
        if (data !== undefined) this.content = data
      })
      .catch((error) => {
        console.log('error', error)
      })

    if (window.innerWidth >= 780) {
      this.isDesktop = true
    }
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize (event) {
      if (event.currentTarget.innerWidth >= 780) {
        this.isDesktop = true
      } else {
        this.isDesktop = false
      }
    },
    openNavigation () {
      this.$emit('toggleMenu')
    },
    closeNavigation (event) {
      this.$emit('toggleMenu')
    },
    async search ($event) {
      if (!this.content.length) {
        try {
          this.content = await ConfigManager.getStatus()
        } catch (error) {
          console.error('Error fetching content', error)
        }
      }
      if (this.searchKeywords) {
        let query = Object.assign({}, this.$route.query, { search: this.searchKeywords })
        this.$router.push({ query })

        this.searchResultsVisible = true
        let filter = 'tag:'
        if (this.searchKeywords.indexOf('tag:') > -1) {
          this.searchResults = this.content.filter(result => {
            let tags = (result.tags || []).map((tag) => {
              return tag.toLowerCase()
            })

            let tagExists = false

            for (let i = 0; i < tags.length; i++) {
              if (tags[i].indexOf(this.searchKeywords.toLowerCase().replace(filter, '')) > -1) {
                tagExists = true
              }
            }

            return tagExists
          })
        } else {
          this.searchResults = this.content.filter(result => {
            return (result.text || '').toLowerCase().indexOf(this.searchKeywords.toLowerCase()) > -1 ||
              (result.name || '').toLowerCase().indexOf(this.searchKeywords.toLowerCase()) > -1
          })
        }
      } else {
        let query = this.$route.query
        delete query.search
        this.$router.push({ query })
        this.reset()
      }
      this.$emit('updateSearchResults', this.searchResults)
      this.$emit('updateSearchKeywords', this.searchKeywords)
    },
    // async searchTopic (tag) {
    //   let filter = `tag:${tag}`
    //   this.searchKeywords = filter
    //   await this.search()
    //   this.$emit('searchTopic', tag)
    // },
    searchTopic (tag) {
      let filter = `tag:${tag}`
      let query = Object.assign({}, this.$route.query, { search: filter })
      this.$router.push({ query })
    },
    reset () {
      this.searchResultsVisible = false
      this.searchKeywords = ''
      this.searchResults = []
      this.$emit('updateSearchKeywords', '')
    }
  }
}
</script>
