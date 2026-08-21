<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  // Drives the wordmark toward its short form. The parent owns the page
  // context that decides this, so the wordmark stays purely presentational.
  compact: { type: Boolean, default: false },
  // The two strings this wordmark types between. Different sites brand this
  // component differently (ismail9k.com's "Ismail9k" vs 9k.school's
  // "9kschool") - the parent supplies its own pair rather than the component
  // assuming one text is a prefix or suffix of the other. Defaults preserve
  // the design system's own identity for consumers that don't override it.
  full: { type: String, default: 'Ismail9k' },
  short: { type: String, default: '9k' },
});

const TYPE_INTERVAL_MS = 90;
const ERASE_INTERVAL_MS = 45;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
// The short wordmark occasionally winks into one of these faces, then back -
// an idle ambient touch, never triggered by anything the visitor does.
const WINK_FACES = ['^_^', '·ᴗ·', '◡̈', '>‿<', 'x_x', 'o_o', '-_-'];
const WINK_MIN_DELAY_MS = 15000;
const WINK_MAX_DELAY_MS = 35000;
const WINK_HOLD_MS = 2000;

const targetWordmark = computed(() => (props.compact ? props.short : props.full));
const visibleWordmark = ref(props.full);
// The cursor only blinks while the wordmark rests, the way a real caret stays
// solid as long as characters keep arriving. Resting blinks are capped in CSS
// so nothing on the page moves once the wordmark settles.
const isResting = ref(true);
// Width is reserved so the navbar never reflows mid-animation, but only for as
// long as it is needed: once settled, a compact wordmark gives its space back,
// which is what makes the short form worth anything on a narrow screen.
const reservedWordmark = computed(() => `${isResting.value ? targetWordmark.value : props.full}_`);
let runToken = 0;
let wordmarkTimer;
let cancelPendingDelay;
let reducedMotionMediaQuery;

const prefersReducedMotion = () => reducedMotionMediaQuery?.matches ?? false;

const waitForWordmark = (duration) =>
  new Promise((resolve) => {
    const finish = () => {
      if (wordmarkTimer !== undefined) window.clearTimeout(wordmarkTimer);
      wordmarkTimer = undefined;
      cancelPendingDelay = undefined;
      resolve();
    };

    wordmarkTimer = window.setTimeout(finish, duration);
    cancelPendingDelay = finish;
  });

const cancelWordmarkAnimation = () => {
  runToken += 1;
  cancelPendingDelay?.();
};

const settleWordmark = (text) => {
  visibleWordmark.value = text;
  isResting.value = true;
};

const typeWordmark = async (text, isCurrentRun) => {
  for (let length = 1; length <= text.length; length += 1) {
    visibleWordmark.value = text.slice(0, length);
    await waitForWordmark(TYPE_INTERVAL_MS);
    if (!isCurrentRun()) return false;
  }

  return true;
};

const eraseWordmark = async (isCurrentRun) => {
  const text = visibleWordmark.value;

  for (let length = text.length - 1; length >= 0; length -= 1) {
    visibleWordmark.value = text.slice(0, length);
    await waitForWordmark(ERASE_INTERVAL_MS);
    if (!isCurrentRun()) return false;
  }

  return true;
};

// Retypes toward whatever the target is now. A target change mid-flight cancels
// the run in progress and starts a fresh one from the characters on screen.
const retypeWordmark = async () => {
  runToken += 1;
  const token = runToken;
  const isCurrentRun = () => token === runToken;

  isResting.value = false;
  if (!(await eraseWordmark(isCurrentRun))) return;
  if (!(await typeWordmark(targetWordmark.value, isCurrentRun))) return;
  isResting.value = true;
};

// Types a random face in over the short wordmark, holds it, then types the
// short wordmark back in. Only ever runs once compact (see scheduleWink), so
// the full wordmark never winks. A target change mid-wink cancels it the
// same way it cancels a retype.
const wink = async () => {
  runToken += 1;
  const token = runToken;
  const isCurrentRun = () => token === runToken;
  const face = WINK_FACES[Math.floor(Math.random() * WINK_FACES.length)];

  isResting.value = false;
  if (!(await eraseWordmark(isCurrentRun))) return;
  if (!(await typeWordmark(face, isCurrentRun))) return;
  isResting.value = true;

  await waitForWordmark(WINK_HOLD_MS);
  if (!isCurrentRun()) return;

  isResting.value = false;
  if (!(await eraseWordmark(isCurrentRun))) return;
  if (!(await typeWordmark(props.short, isCurrentRun))) return;
  isResting.value = true;
};

let winkTimer;

const scheduleWink = () => {
  const delay = WINK_MIN_DELAY_MS + Math.random() * (WINK_MAX_DELAY_MS - WINK_MIN_DELAY_MS);

  winkTimer = window.setTimeout(async () => {
    // The short form is all there is when compact, so a face reads as
    // itself. The full form has more text around it - skip winking until
    // it's compact.
    if (
      props.compact &&
      isResting.value &&
      !prefersReducedMotion() &&
      document.visibilityState === 'visible'
    ) {
      await wink();
    }
    scheduleWink();
  }, delay);
};

watch(targetWordmark, (target) => {
  cancelWordmarkAnimation();

  if (prefersReducedMotion()) {
    settleWordmark(target);
    return;
  }

  void retypeWordmark();
});

const handleReducedMotionChange = () => {
  if (!prefersReducedMotion()) return;

  cancelWordmarkAnimation();
  settleWordmark(targetWordmark.value);
};

onMounted(() => {
  reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  reducedMotionMediaQuery.addEventListener('change', handleReducedMotionChange);

  // A reload partway down the page mounts already-compact: land on the short
  // form rather than animating at someone who never asked for it.
  if (visibleWordmark.value !== targetWordmark.value) settleWordmark(targetWordmark.value);

  scheduleWink();
});

onUnmounted(() => {
  cancelWordmarkAnimation();
  if (winkTimer !== undefined) window.clearTimeout(winkTimer);
  reducedMotionMediaQuery?.removeEventListener('change', handleReducedMotionChange);
});
</script>

<template>
  <span class="brand-visual" :data-reserved="reservedWordmark" aria-hidden="true">
    <span class="brand-current">
      <span class="brand-letter">{{ visibleWordmark }}</span>
      <span class="brand-cursor" :class="{ 'is-blinking': isResting }">_</span>
    </span>
  </span>
</template>

<style scoped>
.brand-visual {
  display: inline-grid;
  font-weight: bold;
  font-size: 1.5rem;
  font-family: var(--font-sans);
}

.brand-visual::before,
.brand-current {
  grid-area: 1 / 1;
}

.brand-visual::before {
  content: attr(data-reserved);
  visibility: hidden;
  white-space: nowrap;
}

.brand-current {
  white-space: nowrap;
}

.brand-letter {
  font-family: var(--font-sans);
  color: var(--theme-text-color);
}

.brand-cursor {
  font-family: var(--font-sans);
  color: var(--primary-color);
}

/* Three blinks on settling, then the caret holds solid as part of the
   wordmark. Nothing in the navbar moves while the page is being read. */
.brand-cursor.is-blinking {
  animation: cursor 1s steps(1, end) 3 forwards;
}

@media (max-width: 768px) {
  .brand-visual {
    font-size: 1.25rem;
  }
}

@media (max-width: 360px) {
  .brand-visual {
    font-size: 1rem;
  }
}

@keyframes cursor {
  0%,
  50% {
    opacity: 1;
  }

  50.01%,
  99.99% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-cursor.is-blinking {
    animation: none;
  }
}
</style>
