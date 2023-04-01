<template>
  <div id="app">
    <Header @toggleMenu="toggleMenu" @updateSearchKeywords="updateSearchKeywords" @updateSearchResults="updateSearchResults" @searchTopic="searchTopic"/>
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
      searchResultsVisible: false,
      searchResults: null,
      searchKeywords: null
    }
  },
  components: {
    Header
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
    search () {
      if (this.searchKeywords) {
        this.searchResultsVisible = true
        // Your search logic here
      } else {
        this.searchResultsVisible = false
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
