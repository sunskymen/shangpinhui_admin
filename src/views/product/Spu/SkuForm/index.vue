<template>
  <div>
    <el-form>
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number" placeholder="价格(元)" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item v-for="(attr,index) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="80" />
          <el-table-column label="图片" prop="prop" width="width">
            <template v-slot="{row,$index}">
              <img :src="row.imgUrl" style="width:100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width="width" />
          <el-table-column label="操作" prop="prop" width="width">
            <template v-slot="{row,$index}">
              <el-button v-if="row.isDefault==0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      // 收集sku 信息
      skuInfo: {
        // 第一类收集的数据是父组件给的
        'category3Id': 0,
        'spuId': 0,
        'tmId': 0,
        // 第二类数据通过双向绑定
        'price': 0,
        'skuName': '',
        'weight': '',
        'skuDesc': '',
        // 第三类赋值
        'skuAttrValueList': [
          // {
          //   'attrId': 0,
          //   'attrName': '',
          //   'id': 0,
          //   'skuId': 0,
          //   'valueId': 0,
          //   'valueName': ''
          // }
        ],
        'skuDefaultImg': '',
        'skuImageList': [
          // {
          //   'id': 0,
          //   'imgName': '',
          //   'imgUrl': '',
          //   'isDefault': '',
          //   'skuId': 0,
          //   'spuImgId': 0
          // }
        ],
        'skuSaleAttrValueList': [
          // {
          //   'id': 0,
          //   'saleAttrId': 0,
          //   'saleAttrName': '',
          //   'saleAttrValueId': 0,
          //   'saleAttrValueName': '',
          //   'skuId': 0,
          //   'spuId': 0
          // }
        ]
      },
      spu: {},
      // 收集图片数据
      imageList: []
    }
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      // 父组件传的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu

      // 发送三个请求
      // 获取图片
      const res = await this.$API.sku.reqSpuImageList(spu.id)
      if (res.code === 200) {
        const list = res.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性
      const res1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
      if (res1.code === 200) {
        this.spuSaleAttrList = res1.data
      }
      // 获取平台属性
      const res2 = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (res2.code === 200) {
        this.attrInfoList = res2.data
      }
    },
    // 图片选中框发生改变
    handleSelectionChange(params) {
      // 数据缺少isDefault字段
      this.imageList = params
    },
    // 图片默认
    changeDefault(row) {
      // 排他操作
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // data设置默认
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消
    cancel() {
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存
    async save() {
      // 整理数据发请求
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 整理平台属性数据方式1
      // const arr = []
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')
      //     const obj = { attrId, valueId }
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr
      // 整理平台属性数据方式2  reduce 返回多个对象的数组
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      // 发请求
      const res = await this.$API.sku.reqAddSku(skuInfo)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('changeScenes', 0)
      }
    }
  }
}
</script>

<style>

</style>
