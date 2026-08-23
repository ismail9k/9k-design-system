<template>
  <div class="i9k-blurred-circles" aria-hidden="true">
    <i
      v-for="circle in 4"
      :key="circle"
      class="i9k-blurred-circle"
      :class="`i9k-blurred-circle--${circle}`"
    />
  </div>
</template>

<style scoped>
.i9k-blurred-circles {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.i9k-blurred-circle {
  position: absolute;
  border-radius: var(--radius-circle);
  filter: blur(80px);
  opacity: 0.1;
  animation: i9k-float 20s ease-in-out infinite;
}
.i9k-blurred-circle--1 {
  top: -100px;
  left: -100px;
  width: 500px;
  height: 500px;
  background: var(--primary-color);
  animation-duration: 15s;
}
.i9k-blurred-circle--2 {
  top: 50%;
  right: -100px;
  width: 400px;
  height: 400px;
  background: var(--accent-color);
}
.i9k-blurred-circle--3 {
  bottom: -50px;
  left: 20%;
  width: 300px;
  height: 300px;
  background: hsl(38 84% 68%);
  animation-duration: 25s;
}
.i9k-blurred-circle--4 {
  top: 30%;
  left: 40%;
  width: 350px;
  height: 350px;
  background: var(--primary-color);
  animation-duration: 18s;
}
@keyframes i9k-float {
  0%,
  100% {
    transform: translate(0) rotate(0);
  }
  50% {
    transform: translate(30px, 30px) rotate(180deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .i9k-blurred-circle {
    animation: none;
  }
}
</style>
