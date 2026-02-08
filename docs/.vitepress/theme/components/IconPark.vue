<script setup lang="ts">
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MapPinOutlined,
  CloudFogOutlined,
  BookOutlined,
  ArticleOutlined,
  TagOutlined,
  FileTextOutlined,
  ReadOutlined,
  HeartOutlined,
  SmileOutlined,
  MessageOutlined,
} from '@iconpark/vue-icons'
</script>

<template>
  <div class="icon-park-container">
    <CalendarOutlined class="icon-calendar" />
    <ClockCircleOutlined class="icon-clock" />
    <MapPinOutlined class="icon-map" />
    <CloudFogOutlined class="icon-fog" />
    <BookOutlined class="icon-book" />
    <ArticleOutlined class="icon-article" />
    <TagOutlined class="icon-tag" />
    <FileTextOutlined class="icon-file" />
    <ReadOutlined class="icon-read" />
    <HeartOutlined class="icon-heart" />
    <SmileOutlined class="icon-smile" />
    <MessageOutlined class="icon-message" />
  </div>
</template>

<style scoped>
.icon-park-container {
  display: none;
}

/* Icon sizes and colors are defined in custom.css */
</style>
