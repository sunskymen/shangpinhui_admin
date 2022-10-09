<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="!show">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="handler1"
        >
          <el-option
            v-for="(c1,index) in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handler2">
          <el-option v-for="(c2,index) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handler3">
          <el-option v-for="(c3,index) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    // 一级分类确认后回调 二级
    async handler1() {
      // 清除前面已经选中的数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.$emit('getCategotyId', { categoryId: this.cForm.category1Id, level: 1 })
      const res = await this.$API.attr.reqCategory2List(this.cForm.category1Id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    async handler2() {
      this.list3 = []
      this.cForm.category3Id = ''
      this.$emit('getCategotyId', { categoryId: this.cForm.category2Id, level: 2 })
      const res = await this.$API.attr.reqCategory3List(this.cForm.category2Id)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    async handler3() {
      this.$emit('getCategotyId', { categoryId: this.cForm.category3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>
