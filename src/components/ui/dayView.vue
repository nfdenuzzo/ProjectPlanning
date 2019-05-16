<template>
  <div class="dayView">
    <el-row>
      <el-col :span="24">
        <div class="grid-content-left autoGrow">
          <noDataDisplay v-if="getCurrentJobsForEmployeesLength == 0"/>
          <jobDisplay v-if="getCurrentJobsForEmployeesLength > 0" @open-close-job-edit="openCloseJobEdit()" v-bind:jobItem.sync="jobItem"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import jobDisplay from '@/components/ui/jobDisplay'
import noDataDisplay from '@/components/ui/noDataDisplay'

export default {
  name: 'dayView',
  components: {
    jobDisplay,
    noDataDisplay
  },
  data () {
    return {
      jobItem: null
    }
  },
  methods: {
    openCloseJobEdit () {
      this.$emit('update:jobItem', this.jobItem)
      this.$emit('open-close-job-edit', true)
    }
  },
  computed: {
    getCurrentJobsForEmployeesLength () {
      return this.$store.getters.getCurrentPlannedJobs.length
    }
  }
}
</script>

<style scoped>

  .dayView {
    position: relative;
    margin: 0px 0px;
  }

  .grid-content-left {
    min-height: 36px;
  }

  .grid-content-right {
    min-height: 36px;
  }

  .autoGrow{
    min-height: 500px;
    height: auto;
  }

  .grid-padding {
    padding: 5px;
  }

  .grid-content-sub-heading {
    min-height: 25px;
    line-height: 25px;
    font-size: 1vw;
    color: #fff;
    background: transparent;
  }

  .grid-content-sub-heading-bg {
    background: #5D6D7E  ;
  }

</style>
