<script lang="ts">
  import { CourseCard } from "$lib/ui/legacy";
  import type { CourseSummary } from "$lib/services/utils/course";
  export let los: CourseSummary[] = [];

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

  function showExample() {
    showExampleDialog = true;
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
    <button on:click={() => showExample()}>Mostrar Ejemplo</button>

    <div class="result">
      {#if result}
        <pre>{result}</pre>
      {/if}
    </div>

    <!-- Cuadro de texto para mostrar el ejemplo -->
    {#if showExampleDialog}
      <div class="example-dialog">
        <p>Aquí tienes un ejemplo:</p>
        <pre>
// Suma dos números
var numero1 = 8;
var numero2 = 17;
var suma = numero1 + numero2;

// Construye un saludo personalizado
var nombre = "Juan";
var saludo = "¡Hola, " + nombre + "!";

// Muestra la suma y el saludo en la consola
console.log(suma);
console.log(saludo);

// Retorna un mensaje
"Operaciones realizadas con éxito."
      </pre>
      </div>
    {/if}
  </main>
</div>

<style>
  /* Estilos CSS para el cuadro de ejemplo */
  .example-dialog {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 10px;
    margin-top: 10px;
  }

  /* Otros estilos */
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
    margin-bottom: 10px;
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
