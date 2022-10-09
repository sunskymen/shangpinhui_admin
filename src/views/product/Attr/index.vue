<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect :show="isShowTable" @getCategotyId="getCategotyId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="category3Id ===''" @click="addAttr">添加属性</el-button>
        <el-table :data="attrList" border style="width:100%">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="" label="属性值列表">
            <template v-slot="{row,$index}">
              <el-tag v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin: 0px 20px ">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性/修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="attrAddValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table border style="margin-top:20px" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{row,$index}">
              <!-- input 与 span 切换 -->
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display:block; height:20px" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" label="操作">
            <template v-slot="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}属性值吗?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'MyAttr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      // 显示table
      isShowTable: true,
      // 收集新增或修改属性
      attrInfo: {
        attrName: '',
        attrValueList: [
        ],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    // 自定义事件回调 子给父传数据
    getCategotyId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    // 获取数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const res = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (res.code === 200) {
        this.attrList = res.data
      }
    },
    // 添加属性input框
    attrAddValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        // 控制查看与编辑
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性
    addAttr() {
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [
        ],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 更新属性
    updateAttr(row) {
      this.isShowTable = false
      // 深拷贝解决复杂类型
      this.attrInfo = cloneDeep(row)
      // 手动添加 :每个属性值加上flag控制查看和编辑
      this.attrInfo.attrValueList.forEach(item => {
        // item.flag = false  这样书写 flag不是响应式数据, 不会发生变化
        // 因为Vue无法探测普通新增的 property
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点,控制查看与编辑
    toLook(row) {
      if (row.valueName.trim() !== '') {
        const isRepat = this.attrInfo.attrValueList.some((item) => {
          // 排除自身去判断
          if (row !== item) {
            return item.valueName === row.valueName.trim()
          }
        })
        if (isRepat) {
          this.$message('输入属性值名称重复')
        } else {
          row.flag = false
        }
      } else {
        this.$message('属性值名称不能为空')
      }
    },
    // 控制查看 编辑
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡框确认删除属性值
    deleteAttrValue(index) {
      // 删除属性值
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮
    async addOrUpdateAttr() {
      // 整理参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName.trim() !== '') {
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 展示表格
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        // 再次获取平台数据
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    }
  }
}
</script>

<style>
</style>
