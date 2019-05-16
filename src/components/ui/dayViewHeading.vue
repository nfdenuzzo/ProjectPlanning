<template>
  <div class="dayViewHeading">
    <el-row>
      <el-col :span="24">
        <div class="grid-content-sub-heading">
          <el-row :gutter="2">
            <!--sequence heading -->
            <el-col :span="1">
              <div class="grid-content-sub-heading grid-content-sub-heading-bg">
                Seq.
              </div>
            </el-col>
            <!-- productive heading -->
            <el-col :span="3">
              <div class="grid-content-sub-heading grid-content-sub-heading-bg">
                Productive
              </div>
            </el-col>
            <!-- job code heading -->
            <el-col :span="4">
              <div class="grid-content-sub-heading grid-content-sub-heading-bg">
                Job Number
              </div>
            </el-col>
            <!-- work code heading -->
            <el-col :span="4">
              <div class="grid-content-sub-heading grid-content-sub-heading-bg">
                Work Centre
              </div>
            </el-col>
            <!-- task heading -->
            <el-col :span="4">
              <div class="grid-content-sub-heading grid-content-sub-heading-bg">
                Task
              </div>
            </el-col>
            <!-- hours heading -->
            <el-col :span="3">
              <div class="grid-content-sub-heading  grid-content-sub-heading-bg">
                Hours
              </div>
            </el-col>
            <!-- operation -->
            <el-col :span="5">
              <div class="grid-content-sub-heading grid-content-sub-heading-bg">
                Operations
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'dayViewHeading'
}
</script>

<style scoped>

  .dayViewHeading {
    position: relative;
    margin: 0px 0px;
  }

  .grid-content-left {
    min-height: 36px;
  }

  .grid-content-right {
    min-height: 36px;
  }

  .grid-content-left-bg {
    padding-top: 2px;
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
