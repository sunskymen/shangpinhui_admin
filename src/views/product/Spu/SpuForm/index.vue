<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option v-for="(tm,index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述" />
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrId">
          <el-option v-for="(unSelect,index) in unSelectSaleAttr" :key="unSelect.id" :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrId" @click="addSaleAttr">添加销售属性</el-button>
        <!-- table展示已有的销售属性 -->
        <el-table border :data="spu.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="属性名" prop="saleAttrName" width="width" />

          <el-table-column label="属性值名称列表" prop="prop" width="width">
            <template v-slot="{row,$index}">
              <!--    -->
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 输入与展示的切换 @blur="handleInputConfirm"-->
              <!--@keyup.enter.native="handleInputConfirm" -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <!--@click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" prop="prop" width="width">
            <template v-slot="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      spu: {
        // 三级分类id
        'category3Id': 0,
        // 描述
        'description': '',
        // 收集spu图片信息
        'spuImageList': [
          // {
          //   'id': 0,
          //   'imgName': 'string',
          //   'imgUrl': 'string',
          //   'spuId': 0
          // }
        ],
        // spu名称
        'spuName': '',
        // 平台属性与属性值
        'spuSaleAttrList': [
          // {
          //   'baseSaleAttrId': 0,
          //   'id': 0,
          //   'saleAttrName': 'string',
          //   'spuId': 0,
          //   'spuSaleAttrValueList': [
          //     {
          //       'baseSaleAttrId': 0,
          //       'id': 0,
          //       'isChecked': 'string',
          //       'saleAttrName': 'string',
          //       'saleAttrValueName': 'string',
          //       'spuId': 0
          //     }
          //   ]
          // }
        ],
        // 品牌id
        'tmId': ''
      }, // spu属性信息, 修改时不是空对象, 添加时是空对象,需要收集信息
      tradeMarkList: [], // 品牌信息
      spuImageList: [], // spu图片数据
      saleAttrList: [], // 获取平台全部销售属性
      attrId: '' // 收集未选择的销售属性id
    }
  },
  computed: {
    // 计算未选择的平台属性
    unSelectSaleAttr() {
      const arr = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return arr
    }
  },
  methods: {
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      // 收集图片
      this.spuImageList = fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // 删除后收集剩余图片
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      // 传递图片url并显示 大图片
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 初始化spu数据
    async initSpuData(spu) {
      // 获取spu信息
      const spuRes = await this.$API.spu.reqSpu(spu.id)
      if (spuRes.code === 200) {
        this.spu = spuRes.data
      }
      // 获取品牌信息
      const tradeMarkRes = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取spu图片数据
      const spuImageRes = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageRes.code === 200) {
        // 处理出展示照片需要的数据 name 和 url
        const listArr = spuImageRes.data
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取平台全部销售属性
      const saleRes = await this.$API.spu.reqBaseSaleAttrList()
      if (saleRes.code === 200) {
        this.saleAttrList = saleRes.data
      }
    },
    // 点击添加属性
    addSaleAttr() {
      // 分割 id name 添加到列表展示
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrId = ''
    },
    // 点击添加属性值
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 输入框失去焦点 属性值push进去数组
    handleInputConfirm(row) {
      // 整理数据
      const { baseSaleAttrId, inputValue } = row
      // 表单校验 不能为空 不能重复
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        this.$refs.saveTagInput.focus()
        return
      }
      const isRepat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (isRepat) {
        this.$message('属性值不能重复')
        this.$refs.saveTagInput.focus()
        return
      }
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)

      row.inputVisible = false
    },
    // 保存
    async addOrUpdateSpu() {
      // 整理参数  图片需要imgUrl imgName
      // this.spuImageList.forEach(item => {
      //   item.imgName = item.name
      //   item.imgUrl = item.response.data
      // })
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      const res = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        // 还要区分保存还是修改
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除表单数据
      Object.assign(this._data, this.$options.data())
    },
    // 父组件点击添加spu
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      // 获取品牌信息
      const tradeMarkRes = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取平台全部销售属性
      const saleRes = await this.$API.spu.reqBaseSaleAttrList()
      if (saleRes.code === 200) {
        this.saleAttrList = saleRes.data
      }
    },
    // 取消按钮
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清除表单数据
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
