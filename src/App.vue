<template>
  <div id="app" v-loading="isLoading">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
  }),
  methods: {
    setGlobalLoading (loading) {
      this.$store.commit({
        type: 'setGlobalLoad',
        load: loading
      })
    },
    loadInitialData () {
      this.setGlobalLoading(true)
      this.$store.dispatch({
        type: 'initializeAllData'
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    }
  },
  computed: {
    isLoading () {
      return this.$store.getters.getGlobalLoad
    }
  },
  created () {
    // Load initial data from server
    this.loadInitialData()
  }
}
</script>

<style>
/* Vue MULTISELECT 2 styling overrides */
.multiselect__single {
  font-size: 12px !important;
  white-space: nowrap !important;
  /* width: 50px !important; */
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.multiselect__option {
  font-size: 12px !important;
}

.multiselect__input {
  width: 80% !important;
}
/* Vue MULTISELECT 2 styling overrides */

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-switch__label{
  color: #fff !important;
}

.el-checkbox{
  color: #fff !important;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #E67E22
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #fff
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #fff
}
</style>
