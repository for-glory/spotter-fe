<template>
  <ion-page
    class="base-layout"
    :class="{ 'has-fixed-header': headerFixed }"
    :style="{
      '--breakpoint': initialBreakpoint * 100 + 'vh',
      '--offset': offsetTop + 'px',
    }"
  >
    <ion-header
      class="header ion-no-border"
      :class="{ 'header--fixed': headerFixed, 'top-24': isPlatform('ios') }"
    >
      <slot name="header"></slot>
    </ion-header>

    <ion-content
      ref="content"
      :fullscreen="true"
      :scroll-events="draggable"
      @ionScroll="onContentScroll"
      @touchend="onContentTouchEnd"
      :scroll-y="initialBreakpoint < 1"
      @touchstart="onContentTouchStart"
      @ionScrollEnd="onContentScrollEnd"
      @ionScrollStart="onContentScrollStart"
      class="page-content has-footer has-header"
      :class="{
        'page-content--full-height': contentFullHeight,
        'page-content--fullscreen': isFullscreenView,
      }"
    >
      <template v-if="draggable">
        <ion-backdrop
          :visible="true"
          :tappable="false"
          :style="{
            opacity:
              1 - scrollPercents < 0
                ? 0
                : 1 - scrollPercents > 1
                ? 1
                : 1 - scrollPercents,
          }"
        >
        </ion-backdrop>
        <div
          class="fixed-content"
          :class="{ 'fixed-content--fullheight': initialBreakpoint === 1 }"
        >
          <slot name="static"></slot>
        </div>

        <div
          class="draggable-content"
          :style="{
            background: draggableBackground,
            '--background': draggableBackground,
          }"
        >
          <span
            draggable="true"
            class="draggable-content__drag-handle"
            :style="{ '--offset': offsetTop + 'px' }"
            :class="{
              'draggable-content__drag-handle--fixed': isFullscreenView,
            }"
          >
          </span>
          <slot name="draggable"></slot>
        </div>
      </template>

      <slot v-else name="content"></slot>
    </ion-content>

    <ion-footer
      v-if="!hideNavigationMenu"
      :class="{ 'page-footer--content-width': !fullWidthFooter }"
      collapse="fade"
      no-border
      class="page-footer ion-no-border"
    >
      <slot name="footer">
        <navigation-menu :items="menu" />
      </slot>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
export default {
  name: "BaseLayout",
};
</script>

<script setup lang="ts">
import {
  defineExpose,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  withDefaults,
} from "vue";
import {
  IonHeader,
  IonPage,
  IonContent,
  IonFooter,
  IonBackdrop,
  isPlatform
} from "@ionic/vue";
import NavigationMenu from "@/general/components/NavigationMenu.vue";
import useRoles from "@/hooks/useRole";
import { navigationMenu as navigation } from "@/const/navigation";
import { IonContentCustomEvent, ScrollDetail } from "@ionic/core";
import { RoleEnum } from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";

const props = withDefaults(
  defineProps<{
    hideNavigationMenu?: boolean;
    headerFixed?: boolean;
    contentFullHeight?: boolean;
    fullWidthFooter?: boolean;
    initialBreakpoint?: number;
    draggable?: boolean;
    offsetTop?: number;
    draggableBackground?: string;
  }>(),
  {
    hideNavigationMenu: false,
    headerFixed: false,
    fullWidthFooter: true,
    contentFullHeight: false,
    initialBreakpoint: 0.5,
    draggable: false,
    offsetTop: 42,
    draggableBackground: "",
  }
);

const content = ref<typeof IonContent | null>(null);
const { role } = useRoles();

const menuType =
  role === RoleEnum.OrganizationOwner ||
  role === RoleEnum.FacilityOwner ||
  role === RoleEnum.Manager
    ? EntitiesEnum.Facility
    : role;
const menu = navigation[menuType];

const scrollToBottom = () => {
  if (content.value) {
    content.value.$el.scrollToBottom(500);
  }
};

const showDraggable = () => {
  content?.value?.$el.scrollToPoint(
    0,
    breakpoint.value - props.offsetTop - safeArea.top,
    draggableOptions.duration
  );
};

defineExpose({
  scrollToBottom,
  showDraggable,
});

const getBreakpoint = (): number => {
  return window.innerHeight * props.initialBreakpoint;
};

if (props.draggable) {
  window.addEventListener("resize", getBreakpoint);
}

const scrollTop = ref<number>(0);
const isDraggableTouched = ref<boolean>(false);
const isOnMove = ref<boolean>(false);
const breakpoint = ref<number>(getBreakpoint());
const isDirectionTop = ref<boolean>(true);
const isOnAutoScroll = ref<boolean>(false);
const isFullscreen = ref<boolean>(scrollTop.value > breakpoint.value);
const isFullscreenView = ref<boolean>(scrollTop.value > breakpoint.value);
const scrollPercents = ref<number>(
  (breakpoint.value - scrollTop.value - props.offsetTop) / breakpoint.value
);
const safeArea = {
  top: parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--ion-safe-area-top"
    )
  ),
  bottom: parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--ion-safe-area-bottom"
    )
  ),
  // top: 50,
  // bottom: 50,
};

onMounted(() => {
  setTimeout(() => {
    safeArea.top = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--ion-safe-area-top"
      )
    );
    safeArea.bottom = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--ion-safe-area-bottom"
      )
    );
  }, 500);
});

const draggableOptions = {
  edges: breakpoint.value / 3,
  duration: 350,
};

const onContentScroll = (event: IonContentCustomEvent<ScrollDetail>) => {
  scrollPercents.value =
    (breakpoint.value - scrollTop.value) / breakpoint.value;
  isDirectionTop.value =
    scrollTop.value < event.detail.scrollTop + props.offsetTop;
  scrollTop.value = event.detail.scrollTop + props.offsetTop;
  isFullscreenView.value =
    scrollTop.value + 2 + safeArea.top >= breakpoint.value;
};

const onContentScrollEnd = () => {
  isOnMove.value = false;
  if (!isDraggableTouched.value && !isOnAutoScroll.value) {
    alignDraggableContent();
  }
};

const onContentScrollStart = () => {
  isOnMove.value = true;
};

const onContentTouchEnd = () => {
  isDraggableTouched.value = false;

  if (!isOnMove.value) {
    alignDraggableContent();
  }
};

const onContentTouchStart = () => {
  isDraggableTouched.value = true;
};

const alignDraggableContent = async () => {
  if (!isDirectionTop.value && scrollTop.value < breakpoint.value) {
    // down
    isOnAutoScroll.value = true;
    await content?.value?.$el.scrollToPoint(
      0,
      scrollTop.value - props.offsetTop + safeArea.top <
        breakpoint.value - draggableOptions.edges
        ? 0
        : breakpoint.value - props.offsetTop - safeArea.top,
      draggableOptions.duration
    );
    setTimeout(() => {
      isOnAutoScroll.value = false;
    }, 200);
  } else if (
    isDirectionTop.value &&
    scrollTop.value > props.offsetTop &&
    breakpoint.value >= scrollTop.value
  ) {
    // up
    isOnAutoScroll.value = true;
    await content?.value?.$el.scrollToPoint(
      0,
      scrollTop.value > draggableOptions.edges
        ? breakpoint.value - props.offsetTop - safeArea.top
        : 0,
      draggableOptions.duration
    );
    setTimeout(() => {
      isOnAutoScroll.value = false;
    }, 200);
  }

  isFullscreen.value =
    scrollTop.value + 1 >= breakpoint.value - props.offsetTop;
};

onUnmounted(() => {
  if (props.draggable) {
    window.removeEventListener("resize", getBreakpoint);
  }
});
</script>

<style scoped lang="scss">
.has-fixed-header {
  z-index: initial;
  contain: size style;
}

.header {
  flex-shrink: 0;

  &--fixed {
    top: 0;
    left: 0;
    right: 0;
    z-index: 1500;
    position: absolute;
  }
}

.page-content {
  overflow: hidden;
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));
  --padding-start: 0;
  --padding-end: 0;

  &::part(scroll) {
    margin-right: -15px;
    padding-right: 15px;
  }

  &::part(scroll)::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.page-footer {
  flex-shrink: 0;

  &--content-width {
    padding: 0 24px calc(20px + var(--ion-safe-area-bottom));

    &:deep(ion-button) {
      margin: 0;
    }
  }
}

.base-layout {
  background-color: var(--gray-800);
}

.fixed-content {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  transition: height 0.35s ease;
  height: calc(var(--breakpoint) + 20px);

  &--fullheight {
    height: 100%;
  }
}

.draggable-content {
  z-index: 50;
  padding-top: 24px;
  position: relative;
  border-radius: 20px 20px 0 0;
  margin-top: var(--breakpoint);
  transition: margin-top 0.35s ease;
  background: var(--ion-background-color);
  min-height: calc(100% - var(--offset) - var(--ion-safe-area-top));

  .modal-handle,
  &__drag-handle {
    left: 0;
    right: 0;
    z-index: 15;
    height: 20px;
    display: block;
    position: absolute;
    pointer-events: none;
    bottom: calc(100% - 20px);
    transition-duration: 0.2s;
    border-radius: 20px 20px 0 0;
    transition-timing-function: ease;
    transition-property: border-radius;
    background: var(--ion-background-color);

    &:after {
      left: 50%;
      content: "";
      bottom: 4px;
      width: 48px;
      height: 4px;
      margin-left: -24px;
      border-radius: 2px;
      position: absolute;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.12);
    }

    &--fixed {
      position: fixed;
      border-radius: 0;
      height: calc(var(--offset) + var(--ion-safe-area-top) + 20px);
      bottom: calc(100% - var(--offset) - var(--ion-safe-area-top) - 20px);
    }
  }
}

.backdrop-no-tappable {
  pointer-events: none;
}
.top-24 {
  top: 24px;
}
</style>
