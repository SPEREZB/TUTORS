<script lang="ts">
  import Icon from "../../Atoms/Icon/Icon.svelte";
  import { getIcon } from "../../Atoms/Icon/themes";
  import type { Lo } from "$lib/services/types/lo";
  import { currentCourse, layout } from "$lib/stores";
  import { onDestroy } from "svelte";
  import { Image } from "$lib/ui/legacy";
  import { cardTransition } from "$lib/ui/animations";
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";

  let offsetX = 0;
  let offsetY = 0;
  const maxOffset = 10; // Cambia esto para ajustar la cantidad de parallax

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    offsetX = ((event.clientX - rect.left - rect.width / 2) / rect.width) * maxOffset;
    offsetY = ((event.clientY - rect.top - rect.height / 2) / rect.height) * maxOffset;
  };

  const resetOffset = () => {
    offsetX = 0;
    offsetY = 0;
  };

  onMount(() => {
    const card = document.querySelector(".card");
    card.addEventListener("mouseleave", resetOffset);
  });

  export let lo: Lo;
  let target = "";
  if (lo.type === "web") {
    if (lo.route.startsWith("http")) {
      target = "_blank";
    }
  }

  if (lo) {
    if (lo.type == "video") {
      lo.route = lo.video;
    }
  }

  let headingText = "";
  let cardWidths = "";

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      headingText = "!text-md font-medium";
      cardWidths = "w-36 h-[18rem]";
    } else {
      headingText = "!text-lg font-semibold";
      cardWidths = "w-60 h-[24rem]";
    }
  });

  onDestroy(unsubscribe);
</script>

<a href={lo.route} {target}>
  <div
    transition:cardTransition
    class="card !bg-green-50 dark:!bg-surface-700 border-{getIcon(lo.type)
      .colour}-500 m-2 {cardWidths} transition-all hover:scale-105"
  >
    <header class="card-header flex flex-row items-center justify-between p-3">
      <div class="inline-flex w-full">
        <div class="text-center line-clamp-2 flex-auto {headingText} !text-black dark:!text-white">
          {lo.title}
        </div>
        {#if $currentCourse && !$currentCourse.areVideosHidden()}
          {#if lo.video && lo.type !== "video"}
            <a href={lo.video}>
              <Icon type="video" />
            </a>
          {/if}
        {/if}
        <div class="flex-none"><Icon type={lo.type} /></div>
      </div>
    </header>
    <div class="card-body">
      <figure class="flex justify-center object-scale-down p-1">
        <Image {lo} />
      </figure>
    </div>
    <footer class="card-footer">
      <div class="prose dark:prose-invert line-clamp-3 text-center leading-6">
        {@html lo.summary}
      </div>
    </footer>
  </div>
</a>

<style>
  a {
    transition: transform 0.3s ease-in-out;
  }

  a:hover {
    transform: translate(10px, 10px);
    color: blue;
  }
</style>
