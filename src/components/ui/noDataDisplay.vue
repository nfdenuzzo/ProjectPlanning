<template>
  <div class="noDataDisplay">
    <el-row>
      <el-col :span="24">
          <div class="grid-content grid-content-bg">
            No Data
            <el-button @click="refreshButtonOnClick" style="margin-left: 15px;" size="medium" type="success" icon="el-icon-refresh" circle></el-button>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'noDataDisplay',
  methods: {
    refreshButtonOnClick () {
      this.setGlobalLoading(true)
      this.$store.dispatch({
        type: 'getPlannedEmployeeJobs'
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    setGlobalLoading (loading) {
      this.$store.commit({
        type: 'setGlobalLoad',
        load: loading
      })
    }
  }
}
</script>

<style scoped>

  .el-row {
    position: relative;
  }

  .noDataDisplay {
    margin-top: 3px;
  }

  .grid-content {
    min-height: 60px;
    font-size: 1vw;
    color: #fff;
    line-height: 60px;
    margin-bottom: 1px;
  }

  .grid-content-bg {
    background: #34495E;
  }
</style>
