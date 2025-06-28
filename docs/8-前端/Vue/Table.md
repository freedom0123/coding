#  Table 组件

```vue

<script setup>
import {onMounted, ref} from "vue";

defineProps({
  msg: {
    type: String,
    required: true,
  },
});
const tableData = [
  {
    id: 1,
    children: [
      {
        id: 2,
        children: [
          {
            id: 3,
          },
          {
            id: 4
          }
        ]
      },
      {
        id: 5
      }
    ]
  },
  {
    id: 10
  }
]
const tableData2 = [
  {
    id: 6,
    children: [
      {
        id: 7 ,
        children: [
          {
            id: 8,
          },
          {
            id: 9
          }
        ]
      },
      {
        id: 10,
      }
    ]
  },
  {
    id: 22
  },
  {
    id: 23
  }
]
/** 获取元素所在的层级 */
const getLevel = (nodes, targetId, currentLevel) => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return currentLevel;
    }
    if (node.children) {
      const result = getLevel(node.children, targetId,currentLevel + 1);
      if (result !== -1) {
        return result;
      }
    }
  }
  return -1;
}
/** 获取某个集合中，相同层级的所有元素 */
const getSameLevelData = (nodes, level) => {
  let descendants = [];
  if(level !== -1) {
    // 获取这个层级之下所有的元素
    for (const node of nodes) {
      descendants.push(node)
    }
    let current = 1;
    while(descendants.length !== 0 && current < level) {
      current += 1;
      let length = descendants.length;
      const sameLevelNode = [];
      for (let i = 0; i < length; i++) {
        if(descendants[i].children) {
          for (const node of descendants[i].children) {
            sameLevelNode.push(node);
          }
        }
      }
      descendants = sameLevelNode;
    }
  }
  return descendants;
}
const tableDataRef = ref(null);
const tableData2Ref = ref(null);
const openTree = (item) => {
  // 当第一个元素处于打开的时候
  tableDataRef.value.toggleRowExpansion(item);
  let level = getLevel(tableData, item.id, 1);
  if(level !== -1) {
    const nodeList = getSameLevelData(tableData, level);
    let index = -1;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id === item.id) {
        index = i;
        break;
      }
    }
    const nodeList2 = getSameLevelData(tableData2, level);
    if(nodeList2 && nodeList2.length > 0 && index !== -1) {
      tableData2Ref.value.toggleRowExpansion(nodeList2[index]);
    }
  }
}
const openTree2 = (item) => {
  // 当第一个元素处于打开的时候
  tableData2Ref.value.toggleRowExpansion(item);
  let level = getLevel(tableData2, item.id, 1);
  if(level !== -1) {
    let nodeList = getSameLevelData(tableData2, level);
    let index = -1;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id === item.id) {
        index = i;
        break;
      }
    }
    nodeList = getSameLevelData(tableData, level);
    if(nodeList && nodeList.length > 0 && index !== -1 && index < nodeList.length) {
      tableDataRef.value.toggleRowExpansion(nodeList[index]);
    }
  }
}
const load =  (row, treeNode, resolve) => {
  console.log('---', row)
  openTree(row)
};
</script>

<template>
  <div style="width: 1200px">
    <el-table
        ref="tableDataRef"
        :data="tableData"
        style="width: 600px"
        row-key="id"
        border
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="id" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="openTree(scope.row)">
            展开
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="width: 1200px">
    <el-table
        ref="tableData2Ref"
        :data="tableData2"
        style="width: 600px"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="id" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="openTree2(scope.row)">
            展开
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

```

