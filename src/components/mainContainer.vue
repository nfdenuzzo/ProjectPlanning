<template>
  <div class="mainContainer">
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="grid-content-left grid-content-left-bg grid-padding autoGrow">
          <employee-container @add-new-job="showAddNewJobDialog()"/>
        </div>
      </el-col>
      <el-col :span="19">
        <el-row>
          <div class="wrapper">
            <el-col :span="24">
              <div class="grid-content-headings" style="margin-right: 10px;">
                <heading/>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="grid-content-main" style="margin-right: 10px;">
                <dayViewHeading/>
                <addNewJob v-if="addNewJobVisible" @close-add-new-job="hideJobDialog()" :isAdd="isAddNewJob" :jobItem="jobItem"/>
                <dayView @open-close-job-edit="showEditJobDialog()" v-bind:jobItem.sync="jobItem"/>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import heading from '@/components/ui/heading'
import addNewJob from '@/components/ui/addNewJob'
import dayView from '@/components/ui/dayView'
import dayViewHeading from '@/components/ui/dayViewHeading'
import employeeContainer from '@/components/ui/employeeContainer'

export default {
  name: 'MainContainer',
  components: {
    heading,
    'employee-container': employeeContainer,
    dayView,
    addNewJob,
    dayViewHeading
  },
  data () {
    return {
      addNewJobVisible: false,
      isAddNewJob: true,
      jobItem: null
    }
  },
  methods: {
    showAddNewJobDialog () {
      if (this.addNewJobVisible) {
        this.addNewJobVisible = false
        this.$nextTick(function () {
          this.addNewJobVisible = true
        })
      } else {
        this.addNewJobVisible = true
      }

      this.isAddNewJob = true
    },
    hideJobDialog () {
      this.addNewJobVisible = false
    },
    showEditJobDialog () {
      if (this.addNewJobVisible) {
        this.addNewJobVisible = false
        this.$nextTick(function () {
          this.addNewJobVisible = true
        })
      } else {
        this.addNewJobVisible = true
      }

      this.isAddNewJob = false
    }
  },
  computed: {
    getGlobalLoadingValue () {
      return this.$store.getters.getGlobalLoad
    }
  },
  watch: {
    getGlobalLoadingValue () {
      this.addNewJobVisible = false
    }
  }
}
</script>

<style scoped>

  .grid-content-left {
    border-radius: 7px;
    min-height: 36px;
    margin: 5px;
    border: 2px solid #B2BABB;
    color: #fff;
  }

  .grid-content-right {
    min-height: 36px;
  }

  .grid-content-left-bg {
    background: #34495e;
  }
  .grid-content-right-bg {
    background: #FBFCFC;
  }

  .autoGrow{
    min-height: 95vh;
    height: auto;
  }

  .grid-padding {
    padding: 5px;
  }

  .grid-content-headings{
    height: 5.8vw;
  }

  .grid-content-main {
    margin-top: 5px;
    min-height: 50vh;
  }
</style>
