<template>
  <!-- 业务逻辑 -->
  <div class="paddingTop">
    <el-table :data="apiData.handlers">
      <!-- 选择操作对象 -->
      <el-table-column label="业务逻辑">
        <template #default="{ $index, row }">
          <div class="cellEx">
            <el-select v-model="row.handlerType" placeholder="操作对象" style="width: 90px" @change="onHanlerTypeChange($index, row)">
              <el-option value="数据库" />
              <el-option value="用户缓存" />
              <el-option value="全局缓存" />
              <el-option value="响应数据" />
            </el-select>

            <!-- 数据库相关操作 -->
            <div v-if="row.handlerType === '数据库'" class="cellEx">
              <!-- 表 -->
              <el-select v-model="row.tableName" filterable placeholder="表名" style="margin-left: 6px; width: 140px">
                <el-option v-for="(value, key) in dbTables" :key="key" :value="key" />
              </el-select>
              <!-- 调用方法 -->
              <el-select v-if="row.tableName !== ''" v-model="row.dbFunc" placeholder=" " style="margin-left: 6px; width: 60px" @change="onHanlerTypeChange($index, row)">
                <el-option value="增" />
                <el-option value="删" />
                <el-option value="改" />
                <el-option value="查" />
              </el-select>

              <div v-if="row.dbFunc === '增'">
                <!-- 是否多条 -->
                <el-select v-if="row.tableName !== ''" v-model="row.dbMulite" placeholder="插入数量" style="margin-left: 6px; width: 100px" @change="onHanlerTypeChange($index, row)">
                  <el-option label="插入单条" value="true" />
                  <el-option label="插入多条" value="false" />
                </el-select>

                <!-- 调用方式 -->
                <el-select v-if="row.dbMulite !== ''" v-model="row.dbRunType" placeholder="实现方式" style="margin-left: 6px; width: 90px" @change="onHanlerTypeChange($index, row)">
                  <el-option value="原生" />
                  <el-option value="映射" />
                </el-select>
              </div>

              <div v-if="row.dbFunc === '删'">
                <!-- 是否多条 -->
                <el-select v-if="row.tableName !== ''" v-model="row.dbMulite" placeholder="删除数量" style="margin-left: 6px; width: 100px" @change="onHanlerTypeChange($index, row)">
                  <el-option label="删除单条" value="true" />
                  <el-option label="删除多条" value="false" />
                </el-select>

                <!-- 依据字段1 -->
                <el-select v-if="row.dbMulite !== ''" v-model="row.dbField1" placeholder="依据字段1" style="margin-left: 6px; width: 120px" @change="onHanlerTypeChange($index, row)">
                  <el-option v-for="item in dbTables[row.tableName].fields" :key="item" :value="item" />
                </el-select>

                <el-select v-if="row.dbField1 !== ''" v-model="row.dbFieldAdd" placeholder="无" style="margin-left: 6px; width: 50px" @change="onHanlerTypeChange($index, row)">
                  <el-option label="无" value="" />
                  <el-option label="或" value="or" />
                  <el-option label="且" value="and" />
                </el-select>

                <!-- 依据字段2 -->
                <el-select v-if="row.dbFieldAdd !== ''" v-model="row.dbField2" placeholder="依据字段2" style="margin-left: 6px; width: 120px" @change="onHanlerTypeChange($index, row)">
                  <el-option v-for="item in dbTables[row.tableName].fields" :key="item" :value="item" :v-if="item !== row.dbField1" />
                </el-select>
              </div>
            </div>

            <!-- 用户缓存相关操作 -->
            <div v-if="row.handlerType === '用户缓存'">用户缓存</div>

            <!-- 全局缓存相关操作 -->
            <div v-if="row.handlerType === '全局缓存'">全局缓存</div>

            <!-- 响应数据相关 -->
            <div v-if="row.handlerType === '响应数据'">响应数据</div>

            <el-button type="danger" class="removeBtn" :disabled="getDeleteBtnEnable(apiData.handlers, $index)" @click="onButtonDeleteParam(apiData.handlers, $index)">
              <el-icon style="font-size: 16px"><CloseBold /></el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

/** 业务逻辑 */
const apiData = reactive({
  handlers: [
    {
      /** 操作的表 */
      tableName: '',
      /** 操作类型 */
      handlerType: '',
      /** 调用方法：增删改查 */
      dbFunc: '',
      /** 是否为多条操作 */
      dbMulite: '',
      /** 数据库操作类型: 原生、映射 */
      dbRunType: '',
      dbField1: '',
      dbFieldAdd: '',
      dbField2: '',
    },
  ],
})

/**
 * 参数变化，判断是否需要添加新的一行
 */
const onHanlerTypeChange = (index, row) => {
  if (row.handlerType === '') {
    return
  }
  if (index + 1 < apiData.handlers.length) {
    return
  }
  apiData.handlers.push({
    /** 操作的表 */
    tableName: '',
    /** 操作类型 */
    handlerType: '',
    /** 调用方法：增删改查 */
    dbFunc: '',
    /** 是否为多条操作 */
    dbMulite: '',
    /** 数据库操作类型: 原生、映射 */
    dbRunType: '',
  })
}

/**
 * 移除一个RESTful参数
 */
const onButtonDeleteParam = (table, index) => {
  table.splice(index, 1)
}
</script>
