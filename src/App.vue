<template>
  <div id="app">
    <Header ref="headerComponent" @toggleMenu="toggleMenu" @updateSearchKeywords="updateSearchKeywords" @updateSearchResults="updateSearchResults" @searchTopic="searchTopic"/>
    <main>
      <nav class="main__nav" :class="{ active: isNavOpen }">
        <vue-tree-navigation :items="tocItems" :defaultOpenLevel="1"/>
      </nav>
      <router-view v-if="!searchResultsVisible"></router-view>
      <div class="container" v-else>
        <h1 class="results__heading" v-if="searchResults.length && searchKeywords.includes('tag:')">{{searchResults.length}} tags matching "{{searchKeywords.replace('tag:', '')}}".</h1>
        <h1 class="results__heading" v-else-if="searchResults.length">{{searchResults.length}} results matching "{{searchKeywords}}".</h1>
        <h1 class="results__heading" v-else-if="!searchResults.length && searchKeywords.includes('tag:')">No tags matching "{{searchKeywords.replace('tag:', '')}}".</h1>
        <h1 class="results__heading" v-else>No results matching "{{searchKeywords}}".</h1>

        <ul class="results__search">
          <li class="result" v-for="(result, index) in searchResults" 
            :key="index">
            <header class="result__header">
              <router-link :to="result.path">
                <h2 class="result__title">{{ result.name }}</h2>
              </router-link>

              <span tabindex="0" v-for="(tag, idx) in result.tags" :key="idx" class="tag" @keyup.enter="searchTopic(tag)" @click="searchTopic(tag)">{{ tag }}</span>
            </header>
            <p>{{ result.text | truncate(300, '...') }}</p>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import ConfigManager from './services/configManager'
import Header from './components/Header'

export default {
  name: 'app',
  data () {
    return {
      baseUrl: '',
      isNavOpen: false,
      tocItems: ConfigManager.getPages(),
      content: [],
      searchResultsVisible: false,
      searchResults: null,
      searchKeywords: null
    }
  },
  components: {
    Header
  },
  created () {
    ConfigManager.getStatus()
      .then((data) => {
        if (data !== undefined) this.content = data
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  methods: {
    toggleMenu () {
      this.isNavOpen = !this.isNavOpen
    },
    updateSearchKeywords (keywords) {
      this.searchKeywords = keywords
      this.search()
    },
    updateSearchResults (results) {
      this.searchResults = results
      this.searchResultsVisible = true
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
    },
    searchTopic (tag) {
      let filter = `tag:${tag}`
      let query = Object.assign({}, this.$route.query, { search: filter })
      this.$router.push({ query })
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (val, oldVal) {
        let url = window.location.href
        if (url.indexOf('?') > -1) {
          let queryString = url.substring(url.indexOf('?') + 1)
          let queryObj = JSON.parse('{"' + decodeURIComponent(queryString.replace(/&/g, '","').replace(/=/g, '": "')) + '"}')
          if (queryObj && queryObj.search) {
            this.searchKeywords = queryObj.search
            this.search()
          }
        } else {
          this.searchKeywords = ''
          this.searchResultsVisible = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import 'styles.scss';

  .tags {
    margin-left: 1rem;
  }

  .result__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.5rem 0;
  }

  .result__header > a {
    max-width: 100%;
  }

  h2.result__title {
    max-width: 100%;
    margin: 0;
    margin-right: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h2.result__title:hover {
    text-decoration: underline;
  }

  .tag {
    padding: 2px 10px;
    margin: 4px 2px;
    font-size: 14px;
    line-height: initial;
    color: white;
    text-align: center;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    background-color: #2d74da;
    border: none;
    border-radius: 20px;
  }

  .tag:hover {
    background-color: #424242;
  }
</style>
