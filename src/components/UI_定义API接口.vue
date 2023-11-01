<template>
  <div class="requestApi">
    <!-- 分组 -->
    <el-input :fit="false" v-model="apiData.group" placeholder="分组" clearable> </el-input>

    <!-- 请求标题 -->
    <el-input :fit="false" v-model="apiData.title" placeholder="标题" clearable class="paddingTop"> </el-input>

    <!-- 接口备注 -->
    <el-input v-model="apiData.desc" class="paddingTop" placeholder="接口备注" />

    <!-- 是否需要登录 -->
    <el-checkbox v-model="apiData.needLogin" class="paddingTop" label="开启登录验证" />

    <!-- 请求类型 + 请求地址 -->
    <div class="baseInfo paddingTop">
      <el-input :fit="false" v-model="apiData.uri" placeholder="请求地址">
        <template #prepend>
          <el-select v-model="apiData.request_type" placeholder="请求类型" style="width: 100px">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="PATCH" value="PATCH" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </template>
      </el-input>
    </div>

    <!-- RESTful参数 -->
    <div class="paddingTop">
      <el-table :data="apiData.RESTfuls" :border="false" class="custom-table">
        <!-- 参数名 -->
        <el-table-column label="RESTful" width="140">
          <template #default="{ $index, row }">
            <el-input :fit="false" v-model="row.name" placeholder="参数名" @change="onRESTfulParamValueChange($index, row)"></el-input>
          </template>
        </el-table-column>
        <!-- 参数类型 -->
        <el-table-column label="" width="140">
          <template #default="{ row }">
            <el-select v-model="row.valueType" placeholder="请求类型" style="width: 100%">
              <el-option label="文本" value="" />
              <el-option label="数字" value=":<N>" />
              <el-option label="字母" value=":<L>" />
              <el-option label="大写字母" value=":<SL>" />
              <el-option label="字母和数字" value=":<LN>" />
              <el-option label="小写字母加数字" value=":<SLN>" />
              <el-option label="大写字母加数字" value=":<BLN>" />
            </el-select>
          </template>
        </el-table-column>
        <!-- 最小长度||最小值||最小成员数 -->
        <el-table-column label="" width="100">
          <template #default="{ row }">
            <el-input v-model="row.minLength" placeholder="文本最大长度" class="inputHideStepBtn" type="number" :min="-1" :max="Number.MAX_SAFE_INTEGER"></el-input>
          </template>
        </el-table-column>
        <!-- 最大长度||最大值||最大成员数 -->
        <el-table-column label="" width="100">
          <template #default="{ row }">
            <el-input v-model="row.maxLength" placeholder="文本最小长度" class="inputHideStepBtn" type="number" :min="-1" :max="Number.MAX_SAFE_INTEGER"></el-input>
          </template>
        </el-table-column>
        <!-- 限制文本 -->
        <el-table-column label="" width="200">
          <template #default="{ row }">
            <el-input v-model="row.allowValues" placeholder="限制文本，以|分割" class="inputHideStepBtn" :min="-1" :max="Number.MAX_SAFE_INTEGER"></el-input>
          </template>
        </el-table-column>
        <!-- 备注 -->
        <el-table-column label="">
          <template #default="{ row }">
            <el-input :fit="false" v-model="row.desc" placeholder="备注"></el-input>
          </template>
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column label="" width="60" align="center">
          <template #default="{ $index }">
            <el-button type="danger" class="removeBtn" :disabled="getDeleteBtnEnable(apiData.RESTfuls, $index)" @click="onButtonDeleteParam(apiData.RESTfuls, $index)">
              <el-icon style="font-size: 16px"><CloseBold /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Query参数 -->
    <div class="paddingTop">
      <el-table :data="apiData.querys">
        <!-- 参数 -->
        <el-table-column label="Query" width="140">
          <template #default="{ $index, row }">
            <el-input :fit="false" v-model="row.name" placeholder="参数名" @change="onQueryParamValueChange($index, row)"></el-input>
          </template>
        </el-table-column>
        <!-- 数据类型 -->
        <el-table-column label="" width="140">
          <template #default="{ row }">
            <el-select v-model="row.valueType" placeholder="数据类型" style="width: 100%">
              <el-option label="文本" value="文本" />
              <el-option label="小数" value="小数" />
              <el-option label="整数" value="整数" />
              <el-option label="长整数" value="长整数" />
              <el-option label="逻辑型" value="逻辑型" />
              <el-option label="JSON对象" value="JSON对象" />
              <el-option label="JSON数组" value="JSON数组" />
            </el-select>
          </template>
        </el-table-column>
        <!-- 是否必填 -->
        <el-table-column label="" width="60">
          <template #default="{ row }">
            <el-checkbox v-model="row.must" label="必填" />
          </template>
        </el-table-column>
        <!-- 最小长度||最小值||最小成员数 -->
        <el-table-column label="" width="80">
          <template #default="{ row }">
            <el-input
              v-model="row.minValue"
              :disabled="getParamMinTitle(row) === ''"
              :placeholder="getParamMinTitle(row)"
              class="inputHideStepBtn"
              type="number"
              :min="-1"
              :max="Number.MAX_SAFE_INTEGER"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 最大长度||最大值||最大成员数 -->
        <el-table-column label="" width="80">
          <template #default="{ row }">
            <el-input
              v-model="row.maxValue"
              :disabled="getParamMaxTitle(row) === ''"
              :placeholder="getParamMaxTitle(row)"
              class="inputHideStepBtn"
              type="number"
              :min="-1"
              :max="Number.MAX_SAFE_INTEGER"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 限制文本 -->
        <el-table-column label="" width="200">
          <template #default="{ row }">
            <el-input
              v-model="row.allowValues"
              :disabled="getParamLimitValueTip(row) === ''"
              :placeholder="getParamLimitValueTip(row)"
              class="inputHideStepBtn"
              type="number"
              :min="-1"
              :max="Number.MAX_SAFE_INTEGER"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 备注 -->
        <el-table-column label="">
          <template #default="{ row }">
            <el-input :fit="false" v-model="row.desc" placeholder="备注"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" width="60" align="center">
          <template #default="{ $index }">
            <el-button type="danger" class="removeBtn" :disabled="getDeleteBtnEnable(apiData.querys, $index)" @click="onButtonDeleteParam(apiData.querys, $index)">
              <el-icon style="font-size: 16px"><CloseBold /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 需要Cookie -->
    <div class="paddingTop">
      <el-table :data="apiData.cookies">
        <!-- cookie名 -->
        <el-table-column label="Cookies" width="200">
          <template #default="{ $index, row }">
            <el-input :fit="false" v-model="row.name" placeholder="Cookie名" @change="onCookieValueChange($index, row)"></el-input>
          </template>
        </el-table-column>
        <!-- 是否必填 -->
        <el-table-column label="" width="60">
          <template #default="{ row }">
            <el-checkbox v-model="row.must" label="必填" />
          </template>
        </el-table-column>
        <!-- cookie作用描述 -->
        <el-table-column label="">
          <template #default="{ row }">
            <el-input :fit="false" v-model="row.desc" placeholder="备注"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="" width="60" align="center">
          <template #default="{ $index }">
            <el-button type="danger" class="removeBtn" :disabled="getDeleteBtnEnable(apiData.cookies, $index)" @click="onButtonDeleteParam(apiData.cookies, $index)">
              <el-icon style="font-size: 16px"><CloseBold /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 需要Header -->
    <div class="paddingTop">
      <el-table :data="apiData.headers">
        <!-- cookie名 -->
        <el-table-column label="Headers" width="200">
          <template #default="{ $index, row }">
            <el-input :fit="false" v-model="row.name" placeholder="Header名" @change="onHeaderValueChange($index, row)"></el-input>
          </template>
        </el-table-column>
        <!-- 是否必填 -->
        <el-table-column label="" width="60">
          <template #default="{ row }">
            <el-checkbox v-model="row.must" label="必填" />
          </template>
        </el-table-column>
        <!-- cookie作用描述 -->
        <el-table-column label="">
          <template #default="{ row }">
            <el-input :fit="false" v-model="row.desc" placeholder="备注"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="" width="60" align="center">
          <template #default="{ $index }">
            <el-button type="danger" class="removeBtn" :disabled="getDeleteBtnEnable(apiData.headers, $index)" @click="onButtonDeleteParam(apiData.headers, $index)">
              <el-icon style="font-size: 16px"><CloseBold /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- POST、PUT等提交的参数 -->
    <div class="paddingTop">
      <el-table :data="apiData.body">
        <!-- 参数 -->
        <el-table-column label="Body" width="140">
          <template #default="{ $index, row }">
            <el-input :fit="false" v-model="row.name" placeholder="参数名" @change="onBodyParamValueChange($index, row)"></el-input>
          </template>
        </el-table-column>
        <!-- 数据类型 -->
        <el-table-column label="" width="140">
          <template #default="{ row }">
            <el-select v-model="row.valueType" placeholder="数据类型" style="width: 100%">
              <el-option label="文本" value="文本" />
              <el-option label="小数" value="小数" />
              <el-option label="整数" value="整数" />
              <el-option label="长整数" value="长整数" />
              <el-option label="逻辑型" value="逻辑型" />
              <el-option label="JSON对象" value="JSON对象" />
              <el-option label="JSON数组" value="JSON数组" />
            </el-select>
          </template>
        </el-table-column>
        <!-- 是否必填 -->
        <el-table-column label="" width="60">
          <template #default="{ row }">
            <el-checkbox v-model="row.must" label="必填" />
          </template>
        </el-table-column>
        <!-- 最小长度||最小值||最小成员数 -->
        <el-table-column label="" width="90">
          <template #default="{ row }">
            <el-input
              v-model="row.minValue"
              :disabled="getParamMinTitle(row) === ''"
              :placeholder="getParamMinTitle(row)"
              class="inputHideStepBtn"
              type="number"
              :min="-1"
              :max="Number.MAX_SAFE_INTEGER"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 最大长度||最大值||最大成员数 -->
        <el-table-column label="" width="90">
          <template #default="{ row }">
            <el-input
              v-model="row.maxValue"
              :disabled="getParamMaxTitle(row) === ''"
              :placeholder="getParamMaxTitle(row)"
              class="inputHideStepBtn"
              type="number"
              :min="-1"
              :max="Number.MAX_SAFE_INTEGER"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 限制文本 -->
        <el-table-column label="" width="200">
          <template #default="{ row }">
            <el-input
              v-model="row.allowValues"
              :disabled="getParamLimitValueTip(row) === ''"
              :placeholder="getParamLimitValueTip(row)"
              class="inputHideStepBtn"
              :min="-1"
              :max="Number.MAX_SAFE_INTEGER"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 备注 -->
        <el-table-column label="">
          <template #default="{ row }">
            <el-input :fit="false" v-model="row.desc" placeholder="备注"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" width="60" align="center">
          <template #default="{ $index }">
            <el-button type="danger" class="removeBtn" :disabled="getDeleteBtnEnable(apiData.body, $index)" @click="onButtonDeleteParam(apiData.body, $index)">
              <el-icon style="font-size: 16px"><CloseBold /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 参数检查失败 -->
    <div class="paddingTop">
      <el-table :data="paramCheckErrorTemplate">
        <el-table-column label="参数检查失败时，返回自定义返回内容，$param 代表参数名">
          <template #default="{ row }">
            <el-input v-model="row.txt" class="paddingTop" placeholder="$param 代表参数名" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 自定义代码段 -->
    <div class="paddingTop">
      <el-table :data="customCode">
        <el-table-column label='自定义代码段。需要删掉<火山程序 类型 = "通常" 版本 = 1 />'>
          <template #default="{ row }">
            <el-input v-model="row.txt" class="paddingTop" type="textarea" :rows="10" placeholder="" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="display: flex; width: 100%; margin-top: 10px">
      <el-button type="info" style="width: 100%" @click="onButtonClear">清空</el-button>
      <el-button type="primary" style="width: 100%" @click="onButtonGenerate">生成</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

/** 数据库表列表 */
const dbTables = {
  game: {
    /** 表名 */
    table: 'game',
    /** 字段列表 */
    fields: ['id', 'name'],
    /** 主键名 */
    mainKey: 'id',
  },
}

const paramCheckErrorTemplate = reactive([{ txt: 'parameter $param is incorrect' }])
/** 获取检查参数错误提示文本 */
const getParamCheckErrorStr = function (param) {
  return paramCheckErrorTemplate[0].txt.replace(/\$param/g, param)
}

/** 自定义代码端 */
const customCode = reactive([{ txt: '' }])
const getCustomCode = function () {
  return customCode[0].txt
}

let apiData = reactive({
  /** 分组 */
  group: '',
  /** 请求名 */
  title: '',
  needLogin: false,
  /** 请求类型 */
  request_type: 'GET',
  /** 请求路由 */
  uri: '',
  /** 接口备注 */
  desc: '',
  /** RESTful参数 */
  RESTfuls: [
    {
      /** 字段名 */
      name: '',
      /** 数据类型，默认文本类型 */
      valueType: '',
      /** 备注 */
      desc: '',
      /** 最小长度||最小值 */
      minLength: '',
      /** 最大长度||最大值 */
      maxLength: '',
      /** 允许的值 */
      allowValues: '',
    },
  ],
  /** RESTful参数 */
  querys: [
    {
      /** 字段名 */
      name: '',
      /** 数据类型，默认文本类型 */
      valueType: '文本',
      /** 必填 */
      must: false,
      /** 可空 */
      empty: true,
      /** 最小长度||最小值 */
      minValue: '',
      /** 最大长度||最大值 */
      maxValue: '',
      /** 允许的值 */
      allowValues: '',
      /** 备注 */
      desc: '',
    },
  ],
  cookies: [
    {
      /** cookie名 */
      name: '',
      /** cookie作用描述 */
      desc: '',
      /** 是否必填 */
      must: true,
    },
  ],
  headers: [
    {
      /** header名 */
      name: '',
      /** header作用描述 */
      desc: '',
      /** 是否必填 */
      must: true,
    },
  ],
  /**
   * POST、PUT等提交的参数
   */
  body: [
    {
      /** 字段名 */
      name: '',
      /** 数据类型，默认文本类型 */
      valueType: '文本',
      /** 必填 */
      must: false,
      /** 可空 */
      empty: true,
      /** 最小长度||最小值 */
      minValue: '',
      /** 最大长度||最大值 */
      maxValue: '',
      /** 允许的值 */
      allowValues: '',
      /** 备注 */
      desc: '',
    },
  ],
})

// console.log(1)
// const temp = JSON.parse(
//   '{"group":"group","title":"title","needLogin":"true","request_type":"GET","uri":"/user","desc":"desc","RESTfuls":[{"name":"str","valueType":"","desc":"","minLength":"","maxLength":"","allowValues":""},{"name":"N","valueType":":<N>","desc":"a士大夫","minLength":"1","maxLength":"2","allowValues":"1|2"},{"name":"L","valueType":":<L>","desc":"b","minLength":"3","maxLength":"4","allowValues":"1|2"},{"name":"BL","valueType":":<SL>","desc":"1321","minLength":"5","maxLength":"6","allowValues":""},{"name":"LN","valueType":":<LN>","desc":"","minLength":"7","maxLength":"8","allowValues":""},{"name":"SLN","valueType":":<SLN>","desc":"8498489","minLength":"6666","maxLength":"44444","allowValues":""},{"name":"BLN","valueType":":<BLN>","desc":"21","minLength":"61651","maxLength":"151515151","allowValues":"12121"},{"name":"","valueType":"","desc":"","minLength":"","maxLength":"","allowValues":""}],"querys":[{"name":"id","valueType":"文本","must":true,"empty":true,"minValue":"1","maxValue":"10","allowValues":"","desc":"123123"},{"name":"num","valueType":"整数","must":false,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":"1"},{"name":"long","valueType":"长整数","must":true,"empty":true,"minValue":"22","maxValue":"333","allowValues":"","desc":"2"},{"name":"bool","valueType":"逻辑型","must":false,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":"3"},{"name":"obj","valueType":"JSON对象","must":true,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":"4"},{"name":"array","valueType":"JSON数组","must":true,"empty":true,"minValue":"1","maxValue":"10","allowValues":"","desc":"5"},{"name":"","valueType":"文本","must":false,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":""}],"cookies":[{"name":"coockie1","desc":"123123123","must":true},{"name":"cookie2","valueType":"","desc":"sdfdsfdsfs"},{"name":"","valueType":"","desc":""}],"headers":[{"name":"ha1","desc":"11111","must":true},{"name":"head3333","valueType":"","desc":"22222"},{"name":"","valueType":"","desc":""}],"body":[{"name":"b_s","valueType":"文本","must":true,"empty":true,"minValue":"1","maxValue":"5","allowValues":"1|2","desc":"123"},{"name":"b_f","valueType":"小数","must":false,"empty":true,"minValue":"3","maxValue":"56","allowValues":"","desc":"123"},{"name":"b_N","valueType":"整数","must":true,"empty":true,"minValue":"1","maxValue":"56","allowValues":"3|5","desc":"3"},{"name":"b_L","valueType":"长整数","must":false,"empty":true,"minValue":"1","maxValue":"23","allowValues":"","desc":"d"},{"name":"b_B","valueType":"逻辑型","must":true,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":"fd"},{"name":"b_O","valueType":"JSON对象","must":false,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":"bfs"},{"name":"b_A","valueType":"JSON数组","must":true,"empty":true,"minValue":"1","maxValue":"3","allowValues":"","desc":"aferf"},{"name":"","valueType":"文本","must":false,"empty":true,"minValue":"","maxValue":"","allowValues":"","desc":""}]}'
// )
// console.log(2, temp)
// let apiData = reactive(temp)

const onButtonClear = () => {
  apiData.group = ''
  apiData.title = ''
  apiData.needLogin = false
  apiData.request_type = 'GET'
  apiData.uri = ''
  apiData.desc = ''
  apiData.RESTfuls = [
    {
      /** 字段名 */
      name: '',
      /** 数据类型，默认文本类型 */
      valueType: '',
      /** 备注 */
      desc: '',
      /** 最小长度||最小值 */
      minLength: '',
      /** 最大长度||最大值 */
      maxLength: '',
      /** 允许的值 */
      allowValues: '',
    },
  ]
  apiData.querys = [
    {
      /** 字段名 */
      name: '',
      /** 数据类型，默认文本类型 */
      valueType: '文本',
      /** 必填 */
      must: false,
      /** 可空 */
      empty: true,
      /** 最小长度||最小值 */
      minValue: '',
      /** 最大长度||最大值 */
      maxValue: '',
      /** 允许的值 */
      allowValues: '',
      /** 备注 */
      desc: '',
    },
  ]
  apiData.cookies = [
    {
      /** cookie名 */
      name: '',
      /** cookie作用描述 */
      desc: '',
      /** 是否必填 */
      must: true,
    },
  ]
  apiData.headers = [
    {
      /** header名 */
      name: '',
      /** header作用描述 */
      desc: '',
      /** 是否必填 */
      must: true,
    },
  ]
  apiData.body = [
    {
      /** 字段名 */
      name: '',
      /** 数据类型，默认文本类型 */
      valueType: '文本',
      /** 必填 */
      must: false,
      /** 可空 */
      empty: true,
      /** 最小长度||最小值 */
      minValue: '',
      /** 最大长度||最大值 */
      maxValue: '',
      /** 允许的值 */
      allowValues: '',
      /** 备注 */
      desc: '',
    },
  ]
}

let volCode_router = ''
let volCode_function = ''

/** 生成火山PC代码 */
const onButtonGenerate = () => {
  let uri = apiData.uri
  console.log(apiData.RESTfuls)

  apiData.RESTfuls.forEach(function (item) {
    if (item.name && item.name !== '') {
      uri += `/:${item.name}${item.valueType}`
    }
  })

  const needLogin = apiData.needLogin ? '真' : '假'
  let paramErrorIndex = 0

  // RESTFul ---------------------------------------------------------------
  let RESTfulParams = []
  apiData.RESTfuls.forEach(function (item) {
    if (item.name && item.name !== '') {
      const minLen = item.minLength === '' ? -1 : item.minLength
      const maxLen = item.maxLength === '' ? -1 : item.maxLength
      RESTfulParams.push(`    变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
    ${item.name} = 请求.取RESTFul参数 (${item.name}, ${minLen}, ${maxLen}, "${item.allowValues}", 参数检查结果)
    如果 (参数检查结果 != E_参数检查结果.成功)
    {
        返回(响应.拒绝访问(${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
    }
`)
    }
  })

  // Query参数 ------------------------------------------------------------------
  let queryParams = []
  apiData.querys.forEach(function (item) {
    if (item.name === '') {
      return
    }

    const allowEmpty = item.must ? '假' : '真'

    if (item.valueType === '文本') {
      queryParams.push(`    变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
      ${item.name} = 请求.取URL参数_文本 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 (${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '小数') {
      queryParams.push(`    变量 ${item.name} <类型 = 小数 注释 = "${item.desc}">
        ${item.name} = 请求.取URL参数_小数 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 (${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '整数') {
      queryParams.push(`    变量 ${item.name} <类型 = 整数 注释 = "${item.desc}">
        ${item.name} = 请求.取URL参数_整数 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 (${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '长整数') {
      queryParams.push(`    变量 ${item.name} <类型 = 长整数 注释 = "${item.desc}">
        ${item.name} = 请求.取URL参数_长整数 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '逻辑型') {
      queryParams.push(`    变量 ${item.name} <类型 = 逻辑型 注释 = "${item.desc}">
        ${item.name} = 请求.取URL参数_逻辑值 ("${item.name}", ${allowEmpty}, 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === 'JSON对象') {
      queryParams.push(`    变量 ${item.name} <类型 = JSON对象类Ex 注释 = "${item.desc}">
        请求.取URL参数_JSON对象 ("${item.name}", ${allowEmpty}, 参数检查结果, ${item.name})
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === 'JSON数组') {
      queryParams.push(`    变量 ${item.name} <类型 = JSON数组类Ex 注释 = "${item.desc}">
        请求.取URL参数_JSON数组 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, 参数检查结果, ${item.name})
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    }
  })

  // Cookie -----------------------------------------------------------------------
  let cookies = []
  apiData.cookies.forEach((item) => {
    if (item.name === '') {
      return
    }

    if (item.must) {
      cookies.push(`        变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
      ${item.name} = 请求.取Cookie ("${item.name}")
        如果 (${item.name} == "")
        {
            返回 (响应.拒绝访问 (${++paramErrorIndex}, ""))
        }
      `)
    } else {
      cookies.push(`        变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
      ${item.name} = 请求.取Cookie ("${item.name}")
      `)
    }
  })

  // Headers -----------------------------------------------------------------------
  let headers = []
  apiData.headers.forEach((item) => {
    if (item.name === '') {
      return
    }

    if (item.must) {
      headers.push(`        变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
      ${item.name} = 请求.取协议头 ("${item.name}")
        如果 (${item.name} == "")
        {
            返回 (响应.拒绝访问 (${++paramErrorIndex}, ""))
        }
      `)
    } else {
      headers.push(`        变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
      ${item.name} = 请求.取协议头 ("${item.name}")
      `)
    }
  })

  // Body参数 ------------------------------------------------------------------
  let bodyParams = []
  apiData.body.forEach(function (item) {
    if (item.name === '') {
      return
    }

    const allowEmpty = item.must ? '假' : '真'

    if (item.valueType === '文本') {
      bodyParams.push(`    变量 ${item.name} <类型 = 文本型 注释 = "${item.desc}">
      ${item.name} = 请求.取参数_文本 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '小数') {
      bodyParams.push(`    变量 ${item.name} <类型 = 小数 注释 = "${item.desc}">
        ${item.name} = 请求.取参数_小数 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '整数') {
      bodyParams.push(`    变量 ${item.name} <类型 = 整数 注释 = "${item.desc}">
        ${item.name} = 请求.取参数_整数 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '长整数') {
      bodyParams.push(`    变量 ${item.name} <类型 = 长整数 注释 = "${item.desc}">
        ${item.name} = 请求.取参数_长整数 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, "${item.allowValues}", 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === '逻辑型') {
      bodyParams.push(`    变量 ${item.name} <类型 = 逻辑型 注释 = "${item.desc}">
        ${item.name} = 请求.取参数_逻辑值 ("${item.name}", ${allowEmpty}, 参数检查结果)
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === 'JSON对象') {
      bodyParams.push(`    变量 ${item.name} <类型 = JSON对象类Ex 注释 = "${item.desc}">
        请求.取参数_JSON对象 ("${item.name}", ${allowEmpty}, 参数检查结果, ${item.name})
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    } else if (item.valueType === 'JSON数组') {
      bodyParams.push(`    变量 ${item.name} <类型 = JSON数组类Ex 注释 = "${item.desc}">
        请求.取参数_JSON数组 ("${item.name}", ${allowEmpty}, ${item.minValue}, ${item.maxValue}, 参数检查结果, ${item.name})
        如果 (参数检查结果 != E_参数检查结果.成功)
        {
            返回 (响应.参数错误 ((${++paramErrorIndex}, ${getParamCheckErrorStr(item.name)}))
        }
        `)
    }
  })

  // 最终代码 ----------------------
  volCode_router = `
<火山程序 类型 = "通常" 版本 = 1 />

方法 初始化 <公开 静态 注释 = "一个功能模块的初始化, 在启动类中调用 静态类.初始化() 进行注册API接口">
{
    FS_注册API接口 (E_请求类型.${apiData.request_type},  "${uri}", ${needLogin}, ${apiData.group}_${apiData.title}, "${apiData.group}", "${apiData.title}", "${apiData.desc}")
}


方法 ${apiData.title} <公开 静态 类型 = 逻辑型 注释 = "${apiData.desc}" 返回值注释 = "返回值无意义">
参数 请求 <类型 = FastServer_请求解析类Ex>
参数 响应 <类型 = FastServer_响应处理类Ex>
参数 数据库 <类型 = Mysql连接类Ex>
参数 用户缓存 <类型 = FastServer_用户缓存类Ex>
参数 全局缓存 <类型 = FastServer_全局缓存类Ex>
{
    变量 参数检查结果 <类型 = E_参数检查结果 值 = E_参数检查结果.成功>
    ${RESTfulParams.length > 0 ? '// RESTful参数 --\r\n' + RESTfulParams.join('') : ''}
    ${queryParams.length > 0 ? '// Query参数 --\r\n' + queryParams.join('') : ''}
    ${cookies.length > 0 ? '// Cookies --\r\n' + cookies.join('') : ''}
    ${headers.length > 0 ? '// Headers --\r\n' + headers.join('') : ''}
    ${bodyParams.length > 0 ? '// body参数 --\r\n' + bodyParams.join('') : ''}
    // 业务逻辑(建议错误码从101开始) -- 
    变量 db_status <类型 = 整数 注释 = "数据库执行结果">
    变量 db_error <类型 = 文本型 注释 = "数据库命令执行错误时返回的错误文本">

${getCustomCode()}

    返回 (响应.发送 (E_HTTP状态码.成功, , ))
}`

  console.log(volCode_router)
  copyToClipboard(volCode_router)
}

function copyToClipboard(text) {
  // 创建一个临时的文本输入框
  const tempInput = document.createElement('textarea')
  tempInput.value = text

  // 将临时的文本输入框添加到页面中
  document.body.appendChild(tempInput)

  // 选中文本
  tempInput.select()

  // 执行复制命令
  document.execCommand('copy')

  // 移除临时的文本输入框
  document.body.removeChild(tempInput)
}

/** 是否禁用删除按钮 */
const getDeleteBtnEnable = (table, index) => {
  if (table.length == 1 || index + 1 === table.length) {
    return true
  }
  return false
}

/**
 * 获取参数类型，最小值、最小长度限制的标题
 */
const getParamMinTitle = (row) => {
  const valueType = row.valueType
  if (valueType === '文本') {
    return '最小长度'
  } else if (valueType === '小数' || valueType === '整数' || valueType === '长整数') {
    return '最小值'
  } else if (valueType === 'JSON数组') {
    return '最小成员数'
  } else {
    return ''
  }
}

/**
 * 获取参数类型，最小值、最小长度限制的标题
 */
const getParamMaxTitle = (row) => {
  const valueType = row.valueType
  if (valueType === '文本') {
    return '最大长度'
  } else if (valueType === '小数' || valueType === '整数' || valueType === '长整数') {
    return '最大值'
  } else if (valueType === 'JSON数组') {
    return '最大成员数'
  } else {
    return ''
  }
}

/**
 * 获取参数类型，限制值的标题
 */
const getParamLimitValueTip = (row) => {
  const valueType = row.valueType
  if (valueType === '文本' || valueType === '小数' || valueType === '整数' || valueType === '长整数') {
    return '限制值，以|分割'
  }
  return ''
}

/**
 * 参数变化，判断是否需要添加新的一行
 */
const onRESTfulParamValueChange = (index, row) => {
  if (row.name === '') {
    return
  }
  if (index + 1 < apiData.RESTfuls.length) {
    return
  }
  apiData.RESTfuls.push({
    /** 字段名 */
    name: '',
    /** 数据类型，默认文本类型 */
    valueType: '',
    /** 备注 */
    desc: '',
    /** 最小长度||最小值 */
    minLength: '',
    /** 最大长度||最大值 */
    maxLength: '',
    /** 允许的值 */
    allowValues: '',
  })
}

/**
 * 参数变化，判断是否需要添加新的一行
 */
const onQueryParamValueChange = (index, row) => {
  if (row.name === '') {
    return
  }
  if (index + 1 < apiData.querys.length) {
    return
  }
  apiData.querys.push({
    name: '',
    valueType: '文本',
    must: false,
    empty: true,
    minValue: '',
    maxValue: '',
    allowValues: '',
    desc: '',
  })
}

/**
 * 移除一个RESTful参数
 */
const onButtonDeleteParam = (table, index) => {
  table.splice(index, 1)
}

/**
 * 参数变化，判断是否需要添加新的一行
 */
const onCookieValueChange = (index, row) => {
  if (row.name === '') {
    return
  }
  if (index + 1 < apiData.cookies.length) {
    return
  }
  apiData.cookies.push({
    name: '',
    valueType: '',
    desc: '',
  })
}

/**
 * 参数变化，判断是否需要添加新的一行
 */
const onHeaderValueChange = (index, row) => {
  if (row.name === '') {
    return
  }
  if (index + 1 < apiData.headers.length) {
    return
  }
  apiData.headers.push({
    name: '',
    valueType: '',
    desc: '',
  })
}

/**
 * 参数变化，判断是否需要添加新的一行
 */
const onBodyParamValueChange = (index, row) => {
  if (row.name === '') {
    return
  }
  if (index + 1 < apiData.body.length) {
    return
  }
  apiData.body.push({
    name: '',
    valueType: '文本',
    must: false,
    empty: true,
    minValue: '',
    maxValue: '',
    allowValues: '',
    desc: '',
  })
}
</script>

<!-- CSS样式 -->
<style lang="scss">
.requestApi {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin: 10px 10px 10px 10px;
  overflow: auto;

  // 基础信息
  .baseInfo {
    width: 100%;
  }

  .paddingTop {
    padding-top: 4px;
  }
}

.removeBtn {
  margin-left: 10px;
  margin-top: 1px;
  padding: 8px 3px 8px 3px !important;
}

.el-table__body {
  .el-table__cell {
    border-bottom: none !important  ;
  }
}

.inputHideStepBtn {
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

/** 在一个cell里放多个组件 */
.cellEx {
  padding-top: 1px;
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
