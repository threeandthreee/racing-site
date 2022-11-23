<template lang="pug">
router-view
</template>

<style>
.fade-in {
  animation: fadeIn 1s;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.w-100 {
  width: 100%
}
</style>