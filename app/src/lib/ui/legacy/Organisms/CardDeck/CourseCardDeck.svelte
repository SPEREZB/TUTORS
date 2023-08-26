<script lang="ts">
  import { CourseCard } from "$lib/ui/legacy";
  import type { CourseSummary } from "$lib/services/utils/course";
  export let los: CourseSummary[] = [];

  let code = "";
  let result = "";

  function executeCode() {
    try {
      // Evaluates the code entered by the user
      result = eval(code);
    } catch (error) {
      result = error.message;
    }
  }
</script>

<div
  class="bg-surface-100-800-token mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4"
>
  <div class="flex flex-wrap justify-center">
    {#each los as lo}
      <CourseCard {lo} />
    {/each}
  </div>

  <main>
    <textarea bind:value={code} placeholder="Ingrese su código aquí" />
    <button on:click={executeCode}>Ejecutar</button>

    <div class="result">
      {#if result}
        <pre>{result}</pre>
      {/if}
    </div>
  </main>

  <style>
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    textarea {
      width: 300px;
      height: 200px;
      margin-bottom: 10px;
    }

    button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }

    .result {
      margin-top: 10px;
    }

    pre {
      background-color: #f3f3f3;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
    }
  </style>
</div>
