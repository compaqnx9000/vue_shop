<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="11">
          <el-button type="warning" @click="onShowAddCateDialog">添加类别</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 分类选择对话框 -->
    <el-dialog title="添加类别" :visible.sync="addCateDialogVisible" width="50%" @close="onClose">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <tree-table
      class="treeTable"
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      border
      :show-row-hover="false"
    >
      <template slot="isok" slot-scope="scope">
        <i
          class="el-icon-success"
          v-if="scope.row.cat_deleted === false"
          style="color: lightgreen"
        ></i>
        <i class="el-icon-error" v-else style="color: red"></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag size="mini" type="info" v-else>三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="scope.row">
          编辑
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="scope.row">
          删除
        </el-button>
      </template>
    </tree-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分類名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      testdata: [
        {
          cat_deleted: false,
          cat_id: 1,
          cat_level: 0,
          cat_name: '大家电',
          cat_pid: 0,
          children: [
            {
              cat_deleted: false,
              cat_id: 3,
              cat_level: 1,
              cat_name: '电视',
              cat_pid: 1
            },
            {
              cat_deleted: false,
              cat_id: 4,
              cat_level: 1,
              cat_name: '空调',
              cat_pid: 1
            },
            {
              cat_deleted: false,
              cat_id: 26,
              cat_level: 1,
              cat_name: '洗衣机',
              cat_pid: 1
            },
            {
              cat_deleted: false,
              cat_id: 45,
              cat_level: 1,
              cat_name: '冰箱',
              cat_pid: 1
            }
          ]
        },
        {
          cat_level: '0',
          cat_name: '热门推荐',
          children: [
            {
              cat_id: 3,
              cat_level: '1',
              cat_name: '圣诞狂欢'
            },
            {
              cat_id: 4,
              cat_level: '1',
              cat_name: '冲锋衣'
            }
          ]
        }
      ]

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    onShowAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })

      this.parentCateList = res.data
      //   this.parentCateList = this.testdata
      console.log(res)
      //   console.log(this.testdata)
    },
    parentCateChanged () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分類失敗')
        }
        this.getCateList()
      })
      this.addCateDialogVisible = false
    },
    onClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
