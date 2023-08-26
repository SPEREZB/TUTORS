<script lang="ts">
  import "$lib/ui/legacy/themes/tutors.css";
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  import "./app.postcss";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { courseUrl, currentCourse, onlineStatus, storeTheme, studentsOnline } from "$lib/stores";

  import {
    NavigationPrimary,
    NavigationPrimaryButton,
    NavigationPrimaryTitle,
    NavigationPrimaryUser,
    NavigationPrimaryUserMenu,
    NavigationPrimaryLayoutMenu
  } from "$lib/components";

  import {
    AppShell,
    popup,
    Toast,
    storePopup,
    type DrawerSettings,
    drawerStore,
    toastStore
  } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";

  import tutors from "$lib/ui/legacy/themes/tutors.css?inline";
  import dyslexia from "$lib/ui/legacy/themes/dyslexia.css?inline";
  import halloween from "$lib/ui/legacy/themes/halloween.css?inline";
  import valentines from "$lib/ui/legacy/themes/valentines.css?inline";
  import Sidebars from "$lib/ui/navigators/sidebars/Sidebars.svelte";
  import PageHeader from "$lib/ui/navigators/PageHeader.svelte";
  import { Footer, NavTitle } from "$lib/ui/legacy";
  import { analyticsService } from "$lib/services/analytics";
  import Icon from "@iconify/svelte";
  import { get } from "svelte/store";

  const themes: any = { tutors, dyslexia, halloween, valentines };
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  export let data: any;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let status: boolean;

  function handleClick() {
    status = !status;
    onlineStatus.set(status);
    analyticsService.setOnlineStatus(status, session);
  }

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  const infoDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "info", position: "left" };
    drawerStore.open(settings);
  };
  const calendarDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "calendar", position: "left" };
    drawerStore.open(settings);
  };
  const tocDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "toc", position: "right" };
    drawerStore.open(settings);
  };
  const onlineDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "online", position: "right" };
    drawerStore.open(settings);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      toastStore.trigger({
        message: "You have successfully logged out!",
        background: "variant-filled-success"
      });
      goto("/");
    }
  };

  onMount(() => {
    status = get(onlineStatus);
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event: any, _session: any) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    storeTheme.subscribe(setBodyThemeAttribute);
    return () => subscription.unsubscribe();
  });

  let isNotCourseRoute: boolean;

  $: {
    isNotCourseRoute =
      !$currentCourse ||
      $page.url.pathname === "/dashboard" ||
      $page.url.pathname === "/time" ||
      $page.url.pathname === "/auth" ||
      $page.url.pathname.length <= 1;
  }
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
  <title>Tutors</title>
</svelte:head>

<AppShell class="h-screen">
  <Toast />
  <Sidebars />
  <svelte:fragment slot="header">
    <NavigationPrimary>
      <svelte:fragment slot="lead">
        {#if isNotCourseRoute}
          <a href="/">
            <NavigationPrimaryTitle title="Tutors" image="/logo.svg" />
          </a>
        {:else}
          <button class="btn btn-sm" on:click={infoDrawerOpen}>
            <Icon
              icon="fluent:info-28-regular"
              color="rgba(var(--color-primary-500))"
              height="20"
            />
          </button>
          <NavTitle />
        {/if}
      </svelte:fragment>
      {#if $currentCourse?.currentWeek}
        <div class="hidden w-full lg:flex">
          <button
            class="mx-auto inline-flex rounded-lg variant-soft-primary p-2"
            on:click={calendarDrawerOpen}
          >
            <span class="my-auto pl-2 pr-4">
              <Icon
                icon="fluent:calendar-ltr-12-regular"
                color="rgba(var(--color-primary-500))"
                height="20"
              />
            </span>
            <span class="divider-vertical h-12 hidden lg:flex my-auto" />
            <span class="px-2">
              <span class="pt-1 text-sm">Current Week</span><br />
              <span class="text-lg pb-1 font-bold">{$currentCourse.currentWeek.title}</span>
            </span>
          </button>
        </div>
      {/if}

      <svelte:fragment slot="trail">
        {#if !isNotCourseRoute}
          <a href="http://localhost:3000/codificar">
            <img
              src="data:image/png;base64,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"
              alt=""
              width="35"
              height="25"
              margin-left="20"
            />
          </a>

          <a href="http://localhost:3000/course/tutors-reference">
            <img
              src="data:image/png;base64,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"
              alt=""
              width="35"
              height="25"
              margin-left="20"
            />
          </a>

          <a href="javascript:history.back()">
            <img src="https://acortar.link/JOuHap" alt="" width="35" height="25" margin-left="20" />
          </a>

          <NavigationPrimaryButton
            href="/search/{$courseUrl}"
            icon="fluent:search-24-filled"
            iconColour="rgba(var(--color-primary-500))"
            label="Search"
          />
          <span class="divider-vertical h-10 hidden lg:block" />
        {/if}
        {#if data.session}
          <div class="relative">
            <button use:popup={{ event: "click", target: "avatar" }}>
              <NavigationPrimaryUser
                avatar={data.session.user.user_metadata.avatar_url}
                name={data.session.user.user_metadata.name}
                onlineStatus={isNotCourseRoute ? undefined : status}
                usersOnline={isNotCourseRoute ? undefined : $studentsOnline.toString()}
              />
            </button>
            <NavigationPrimaryUserMenu
              {isNotCourseRoute}
              name={data.session.user.user_metadata.name}
              username={data.session.user.user_metadata.preferred_username}
              userId={data.session.user.id}
              onlineStatus={isNotCourseRoute ? undefined : status}
              usersOnline={isNotCourseRoute ? undefined : $studentsOnline.toString()}
              currentCourseId={$currentCourse?.id}
              currentCourseUrl={$currentCourse?.url}
              {handleClick}
              {handleSignOut}
              {onlineDrawerOpen}
            />
          </div>
        {:else}{/if}
        <span class="divider-vertical h-10 hidden lg:block" />
        <NavigationPrimaryLayoutMenu />
        {#if !isNotCourseRoute}
          <span class="divider-vertical h-10 hidden lg:block" />
          <button class="btn btn-sm" on:click={tocDrawerOpen}>
            <NavigationPrimaryButton
              icon="fluent:line-horizontal-3-20-filled"
              iconColour="rgba(var(--color-primary-500))"
            />
          </button>
        {/if}
      </svelte:fragment>
    </NavigationPrimary>

    {#if !isNotCourseRoute}
      <PageHeader />
    {/if}
  </svelte:fragment>
  <slot />

  <svelte:fragment slot="pageFooter">
    {#if $page.url.pathname !== "/" && $page.url.pathname !== "/auth" && $page.url.pathname !== "/dashboard"}
      <div
        class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2"
      >
        <Footer />
      </div>
    {/if}
  </svelte:fragment>
</AppShell>
