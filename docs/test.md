---
# 禁用 VitePress 默认的 Home 布局，使用自定义组件
layout: home 
title: IvoryGate的个人知识库
---

<script setup>
// 引入刚才创建的组件
// 请确保路径正确，指向你存放 Tags.vue 的位置
import HomeHero from './.vitepress/theme/components/HomeHero.vue'
</script>

<HomeHero />