<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0" @click="showDialog">添加</el-button>
    <!-- 表格:data 数组展示数据 label 标题 -->
    <el-table style=" width:100% " border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template v-slot="{ row, $index }">
          <!-- row 作用域插槽回传的数组对象形式 -->
          <img :src="row.logoUrl" style="width:100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器     @current-change="" -->
    <el-pagination style="margin-top:20px; textAlign: center;" :total="total - 0" :current-page="page - 0"
      :page-size="limit - 0" :pager-count="7" :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total" @current-change="getPageList"
      @size-change="handleSizeChange" />

    <!-- 对话框
      :visible.sync 显示与隐藏
      -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- :model数据收集 -->
      <el-form ref="ruleForm" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片不是表单元素,不能使用v-model
          action 上传图片地址-->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'TradeMark',
  data() {
    // 这里可以自定义验证规则
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      page: '2',
      limit: '3',
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请输入品牌图片', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 请求数据
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const res = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求
          const res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          console.log(res)
          if (res.code === 200) {
            // 弹出添加成功信息: 修改成功 添加成功
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 添加品牌刷新第一页, 修改则停留当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          alert('提交失败')
          return false
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        } else {
          return new Error()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
