<template>
  <div>
    <el-table border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column label="默认图片" width="110">
        <template v-slot="{row,$index}">
          <img :src="row.skuDefaultImg" width="80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80" />
      <el-table-column prop="price" label="价格(元)" width="80" />
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{row,$index}">
          <el-button v-if="row.isSale==0" type="success" icon="el-icon-sort-down" size="mini" @click="cancelSale(row)" />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="sale(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  -->
    <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper, ->, sizes, total" style="text-align:center" @current-change="getData" @size-change="handleSizeChange" />

    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" type="primary" style="margin-right:10px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="500px">
            <el-carousel-item v-for="(item,index) in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'MySku',
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      skuInfo: {},
      // drawer控制抽屉显示
      drawer: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const res = await this.$API.sku.reqSKUList(page, limit)
      if (res.code === 200) {
        this.records = res.data.records
        this.total = res.data.total
      }
    },
    // 改变页显示数
    handleSizeChange(limit) {
      this.limit = limit
      this.getData()
    },
    // 下架
    async cancelSale(row) {
      const res = await this.$API.sku.reqCancelSale(row.id)
      if (res.code === 200) {
        // eslint-disable-next-line require-atomic-updates
        row.isSale = 0
        this.$message({
          type: 'success',
          message: '下架成功'
        })
      }
    },
    // 上架
    async sale(row) {
      const res = await this.$API.sku.reqOnSale(row.id)
      if (res.code === 200) {
        // eslint-disable-next-line require-atomic-updates
        row.isSale = 1
        this.$message({
          type: 'success',
          message: '上架成功'
        })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    // Sku详情
    async getSkuInfo(row) {
      // 展示抽屉
      this.drawer = true
      const res = await this.$API.sku.reqSkuById(row.id)
      if (res.code === 200) {
        this.skuInfo = res.data
      }
    }
  }
}
</script>

<style scoped>
  .el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
  }
  .el-col {
    margin: 10px 10px;
  }
  /* 测试深度选择器 */
  /* 修改轮播图样式 */
  ::v-deep .el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: #99a9bf;
    border-radius: 50%;
  }
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  /* 修改轮播图样式
  .el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: #99a9bf;
    border-radius: 50%;
  } */
</style>
