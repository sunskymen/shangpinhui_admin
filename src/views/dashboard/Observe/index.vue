<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card><Search></Search></el-card>
      </el-col>
      <el-col :span="12">
        <el-card><Category></Category></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from './Category'
import Search from './Search'
export default {
  components: {
    Category,
    Search
  }
}
</script>

<style scoped>
</style>
