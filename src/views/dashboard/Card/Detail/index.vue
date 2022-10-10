<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg t="1661671623494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="1478" width="16" height="16">
        <path
          d="M512 141.21142578a370.78857422 370.78857422 0 1 0 370.78857422 370.78857422A370.78857422 370.78857422 0 0 0 512 141.21142578z m0 701.36084902A330.5722748 330.5722748 0 1 1 842.5722748 512 330.85749666 330.85749666 0 0 1 512 842.5722748z"
          fill="#515151" p-id="1479" />
        <path
          d="M483.47780227 711.65538634h57.04439546V426.43340606h-57.04439547zM483.47780227 369.38900986h57.04439546V312.34461366h-57.04439547z"
          fill="#515151" p-id="1480" />
      </svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts" />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyDetail',
  props: ['title', 'count']
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}

.card-content {
  font-size: 30px;
  padding: 10px 0;
}

.card-charts {
  height: 50px;
}

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>
