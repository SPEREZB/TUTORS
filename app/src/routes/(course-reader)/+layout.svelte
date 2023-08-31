<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { get } from "svelte/store";
  import { writable } from "svelte/store";
  import { setInitialClassState, toastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import {
    transitionKey,
    currentLo,
    onlineStatus,
    studentsOnlineList,
    studentsOnline
  } from "$lib/stores";
  import PageTransition from "$lib/ui/PageTransition.svelte";
  import { getKeys } from "$lib/environment";
  import { analyticsService } from "$lib/services/analytics";
  import { initServices } from "$lib/services/tutors-startup";
  import type { RealtimeChannel } from "@supabase/supabase-js";
  import {
    setupPresence,
    subscribePresence,
    unsubscribePresence,
    updatePresence
  } from "$lib/services/presence";

  // Obtiene la URL del archivo actual
  const currentURL = import.meta.url;

  // Extrae la ruta del directorio del archivo actual
  const directoryPath = currentURL.substring(0, currentURL.lastIndexOf("/"));

  let currentRoute = "";

  export let data: any;
  let { supabase, session } = data;

  function updatePageCount() {
    if (
      !document.hidden &&
      !currentRoute.startsWith("/live") &&
      !currentRoute.startsWith("/dashboard")
    ) {
      analyticsService.updatePageCount(session);
    }
  }

  onMount(() => {
    console.log(import.meta.url);
    setInitialClassState();
    initServices(data.session);
    setInterval(updatePageCount, 30 * 1000);
  });

  let code = "";
  let result = "";

  let showExampleDialog = false;

  function executeCode() {
    try {
      // Evaluates the code entered by the user
      result = eval(code);
    } catch (error) {
      result = error.message;
    }
  }
  function navigateToNewPage() {
    showExampleDialog = false;
    result = ""; // Limpia el resultado
    page.navigateTo("otra-pagina"); // Cambia "otra-pagina" por la URL que deseas
  }
  function showExample() {
    showExampleDialog = true;
  }

  let presenceSetup: boolean = false;

  function setupPresenceLocally() {
    setupPresence(supabase, $page.params.courseid);
    setTimeout(() => {
      presenceSetup = true;
    }, 1000);
  }

  function unsubscribePresenceLocally() {
    unsubscribePresence();
    presenceSetup = false;
  }

  $: {
    if (!presenceSetup && data.session && $onlineStatus) {
      setupPresenceLocally();
    } else if (!$onlineStatus && presenceSetup) {
      unsubscribePresenceLocally();
    }
  }

  $: {
    if (
      $currentLo &&
      data.session &&
      presenceSetup &&
      ($onlineStatus || $onlineStatus === undefined)
    ) {
      updatePresence({
        studentName: session.user.user_metadata.full_name,
        studentEmail: session.user.user_metadata.email,
        studentImg: session.user.user_metadata.avatar_url,
        courseTitle: get(currentLo).parentLo ? get(currentLo).parentLo.title : get(currentLo).title,
        loTitle: get(currentLo).title,
        loImage: get(currentLo).img,
        loRoute: get(currentLo).route,
        loIcon: get(currentLo).icon
      });
    }
  }

  $: {
    if (
      $onlineStatus &&
      data.session &&
      presenceSetup &&
      ($onlineStatus || $onlineStatus === undefined)
    ) {
      subscribePresence(
        {
          studentName: session.user.user_metadata.full_name,
          studentEmail: session.user.user_metadata.email,
          studentImg: session.user.user_metadata.avatar_url,
          courseTitle: get(currentLo).parentLo
            ? get(currentLo).parentLo.title
            : get(currentLo).title,
          loTitle: get(currentLo).title,
          loImage: get(currentLo).img,
          loRoute: get(currentLo).route,
          loIcon: get(currentLo).icon
        },
        $page.params.courseid
      );
    }
  }

  page.subscribe((path) => {
    if (path.route.id) {
      currentRoute = path.route.id;
    }
    if (path.params.courseid && getKeys().firebase.apiKey !== "XXX") {
      analyticsService.learningEvent(path.params, session);
    }
    if (path.url.hash && !path.url.hash.startsWith("#access_token")) {
      const el = document.querySelector(`[id="${path.url.hash}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  afterNavigate((params) => {
    if (!$page.url.hash) {
      const isNewPage = params.from && params.to && params.from.route.id !== params.to.route.id;
      const elemPage = document.querySelector("#page");
      if (isNewPage && elemPage !== null) {
        elemPage.scrollTop = 0;
      }
    }
  });
</script>

<svelte:head>
  {#if currentLo}
    <title>{$currentLo.title}</title>
  {:else}
    <title>Tutors Course Reader</title>
  {/if}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  <div id="top" />
  <div class="mx-auto my-4">
    <PageTransition url={$transitionKey}>
      <slot />
    </PageTransition>

    <main>
      <textarea bind:value={code} placeholder="Ingrese su código aquí" />
      <button
        style="    background-color: #007bff;
    color: white;
"
        on:click={executeCode}>Ejecutar</button
      >
      <button on:click={() => showExample()}>Mostrar Ejemplo</button>

      <div class="result">
        {#if result}
          <div class="example-code">{result}</div>
        {/if}
      </div>

      <!-- Cuadro de texto para mostrar el ejemplo -->
      {#if showExampleDialog}
        <div class="example-dialog">
          <p class="example-code">Aquí tienes un ejemplo:</p>
          <div class="example-code">
            // Suma dos números<br />
            var numero1 = 8;<br />
            var numero2 = 17;<br />
            var suma = numero1 + numero2;<br /><br />

            // Construye un saludo personalizado<br />
            var nombre = "Juan";<br />
            var saludo = "¡Hola, " + nombre + "!";<br /><br />

            // Muestra la suma y el saludo en la consola<br />
            console.log(suma);<br />
            console.log(saludo);<br /><br />

            // Retorna un mensaje<br />
            "Operaciones realizadas con éxito."
          </div>
        </div>
      {/if}
    </main>

    <style>
      .example-dialog {
        background-color: #c8e6c9;
        border: 1px solid #ddd;
        padding: 10px;
        margin-top: 10px;
      }

      /* Estilos para el código de ejemplo */
      .example-code {
        background-color: #c8e6c9; /* Verde claro */
        color: black; /* Texto en negro */
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
        width: 450px; /* Ancho de 150px */
      }

      main {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      textarea {
        width: 800px;
        height: 200px;
        margin-bottom: 10px;
      }

      button {
        padding: 8px 16px;
        cursor: pointer;
      }

      .result {
        margin-top: 10px;
      }

      pre {
        background-color: #c8e6c9;
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
      }
    </style>
  </div>
</div>
