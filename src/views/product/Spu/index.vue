<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect :show="scene ===0" @getCategotyId="getCategotyId" />
    </el-card>
    <el-card>
      <!-- 三个div切换 -->
      <div v-show="scene==0">
        <!-- 展示列表结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="spuName" label="spu名称" width="width" />
          <el-table-column prop="description" label="spu描述" width="width" />
          <el-table-column prop="" label="操作" width="width" >
            <template v-slot="{row,$index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)" />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器   -->
        <el-pagination
          style="text-align:center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="getSpuList(pager)"
          @size-change="handleSizeChange"
        />
      </div>

      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene" />

      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes" />

      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeViewer">
        <el-table v-loading="loading" :data="skuList" border>
          <el-table-column label="名称" width="width" prop="skuName" />
          <el-table-column label="价格" width="width" prop="price" />
          <el-table-column label="重量" width="width" prop="weight" />
          <el-table-column label="默认图片" width="width" prop="skuDefaultImg">
            <template v-slot="{row,$index}">
              <img :src="row.skuDefaultImg" width="100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 引入子组件
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: 'MySpu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      // 存储spu的数据
      records: [],
      total: 0,
      scene: 0, // 0展示spu列表数据 1 添加修改spu 2 添加sku
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 三级联动自定义事件传递的 id
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
        this.getSpuList()
      }
    },
    // 根据id 1 2 3获取列表数据
    async getSpuList(pager = 1) {
      try {
        this.page = pager
        const { page, limit, category3Id } = this
        const res = await this.$API.spu.reqSpuList(page, limit, category3Id)
        this.records = res.data.records
        this.taotal = res.data.total
      } catch (error) {
        alert('获取失败')
      }
    },
    // 改变当前页
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getSpuList()
    // }
    // 分页器条数发生变化
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 显示添加spu
    addSpu() {
      this.scene = 1
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改spu
    updateSpu(row) {
      this.scene = 1
      // 直接操作子组件获取数据
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件回调 scene 显示
    changeScene({ scene, flag }) {
      // flag 区分 保存还是添加
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu
    async deleteSpu(row) {
      const res = await this.$API.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getSpuList(this.records.length < 1 ? this.page - 1 : this.page)
      }
    },
    // 添加sku
    addSku(row) {
      this.scene = 2
      // 父组件调用子组件的方法
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 自定义事件回调 scenes 显示
    changeScenes(scenes) {
      this.scene = scenes
    },
    // 查看sku
    async handler(spu) {
      this.dialogTableVisible = true
      // 保存当前行的信息
      this.spu = spu
      // 请求数据
      const res = await this.$API.sku.reqSkuList(spu.id)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false
      }
    },
    // 关闭dialog
    closeViewer(done) {
      this.loading = true
      // 清空数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>

<style>
</style>
