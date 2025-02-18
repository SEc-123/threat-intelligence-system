<script setup lang="ts">
import { ref } from 'vue';
import { monitoringAPI } from '../api/monitoring';

const config = ref({
  keywords: ['CVE'],
  interval: 6,
  sources: ['aliyun']
});

const submitConfig = async () => {
  try {
    await monitoringAPI.createConfig(config.value);
    alert('Configuration saved!');
  } catch (error) {
    alert('Error saving config');
  }
};
</script>

<template>
  <div class="config-form">
    <h2>Monitoring Configuration</h2>
    <form @submit.prevent="submitConfig">
      <div>
        <label>Keywords:</label>
        <input v-model="config.keywords" type="text" placeholder="Comma-separated keywords">
      </div>
      <div>
        <label>Interval (hours):</label>
        <input v-model="config.interval" type="number" min="1" max="24">
      </div>
      <button type="submit">Save Config</button>
    </form>
  </div>
</template>
