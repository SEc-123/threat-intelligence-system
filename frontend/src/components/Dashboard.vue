<template>
  <div class="dashboard">
    <h2>Threat Intelligence Dashboard</h2>
    <div class="charts">
      <VulnTrendChart />
    </div>
  </div>
</template>

<script setup>
import VulnTrendChart from './VulnTrendChart.vue';
</script>
