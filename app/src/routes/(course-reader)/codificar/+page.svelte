<script>
  import { onMount } from "svelte";
  import CodeMirror from "codemirror";
  import "codemirror/lib/codemirror.css";
  import "codemirror/mode/javascript/javascript";

  let code = 'console.log("Hello, world!");';
  let output = "";

  const runCode = () => {
    try {
      output = "";
      const result = eval(code); // Ejecuta el código en un entorno seguro
      if (result !== undefined) {
        output = String(result);
      }
    } catch (error) {
      output = `Error: ${error.message}`;
    }
  };

  let editor;

  onMount(() => {
    editor = CodeMirror.fromTextArea($refs.textarea, {
      lineNumbers: true,
      mode: "javascript"
    });
  });
</script>

<div class="editor-container">
  <textarea bind:this={editor} class="editor" rows="10" cols="40" style="display: none;" />
  <button on:click={runCode}>Run</button>
  <pre>{output}</pre>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
  }
</style>
