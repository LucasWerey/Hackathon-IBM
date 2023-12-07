<script lang="ts">
  import Box from "../box.svelte";
  import Recorder from "../voicerecorder.svelte";

  let files: File[] = [];
  let selectedFile: File | null = null;
  let droppedFileName: string = "";
  let data: string = "";
  let isLoading: boolean = false;
  let isEmailBoxOpen: boolean = false;
  let hasError: boolean = false;
  let confidence: number = 0;
  let selectedLanguage: string = "en-US";

  const languages = [
    { name: "English", code: "en-US", flag: "🇺🇸" },
    { name: "French", code: "fr-FR", flag: "🇫🇷" },
    { name: "German", code: "de-DE", flag: "🇩🇪" },
    { name: "Italian", code: "it-IT", flag: "🇮🇹" },
    { name: "Spanish", code: "es-ES", flag: "🇪🇸" },
    { name: "Portuguese", code: "pt-PT", flag: "🇵🇹" },
    { name: "Russian", code: "ru-RU", flag: "🇷🇺" },
    { name: "Japanese", code: "ja-JP", flag: "🇯🇵" },
    { name: "Korean", code: "ko-KR", flag: "🇰🇷" },
    { name: "Chinese", code: "zh-CN", flag: "🇨🇳" },
  ];

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    files = droppedFiles.filter((file) => file.type === "audio/mpeg");
    if (files.length > 0) {
      selectedFile = files[0];
      droppedFileName = files[0].name;
    }
    console.log(files);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleFileSelect = (event: Event) => {
    const selectedFiles = Array.from(
      (event.target as HTMLInputElement).files || []
    );
    files = selectedFiles.filter((file) => file.type === "audio/mpeg");
    if (files.length > 0) {
      selectedFile = files[0];
      droppedFileName = files[0].name;
    }
    console.log(files);
  };

  const handleSelectedAudio = async (event: CustomEvent) => {
    const audioBlob = event.detail.audioBlob;
    const fileName = "audioFile.mp3";
    const audioFile = blobToFile(audioBlob, fileName);

    selectedFile = audioFile;
    droppedFileName = fileName;
  };

  const blobToFile = (theBlob: BlobPart, fileName: string) => {
    const file = new File([theBlob], fileName, { type: "audio/mpeg" });
    return file;
  };

  const handleSelectLanguage = () => {
    selectedLanguage = (
      document.getElementById("language") as HTMLSelectElement
    ).value;
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    isLoading = true;

    const formData = new FormData();
    console.log(selectedLanguage);
    console.log(typeof selectedFile);
    formData.append("file", selectedFile);
    formData.append("language", selectedLanguage);
    console.log(formData);
    try {
      const response = await fetch("http://localhost:3000/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        data = result.transcription;
        confidence = result.confidence;
        console.log(result);
      } else {
        hasError = true;
        console.error("Server returned an error:", response.statusText);
      }
    } catch (error) {
      hasError = true;
      console.error("An error occurred:", error);
    } finally {
      isLoading = false;
    }
  };

  const handleOpenEmailBox = () => {
    isEmailBoxOpen = !isEmailBoxOpen;
  };

  const sendEmail = async (event: CustomEvent) => {
    const email = event.detail.email;
    console.log("suuuuu", email);
  };
</script>

<main class="m-5" class:blurClass={isEmailBoxOpen}>
  <div class="flex w-full h-full flex-col gap-6">
    <div
      class="flex md:flex-row flex-col gap-4 w-full md:justify-between items-center"
    >
      <div class="flex items-center justify-center">
        <h1 class="text-5xl text-emerald-600 font-bold">Hackathon</h1>
      </div>
      <div
        id="dropDown"
        class="flex justify-center items-center gap-5 right-10 top-6 h-10 w-20 bg-white rounded-lg border-solid border-emerald-500 border-2"
      >
        <select
          name="language"
          id="language"
          class="flex justify-center items-center align-middle"
          on:change={handleSelectLanguage}
        >
          {#each languages as language}
            <option value={language.code} id="dropDown">{language.flag}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="w-full h-full flex justify-center items-center">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        id="FilesDropzone"
        class="flex items-center justify-center w-1/2 h-[100px] align-middle border-2 border-dashed border-gray-300 rounded-lg"
        on:drop={handleDrop}
        on:dragover={handleDragOver}
        on:click={handleClick}
        role="button"
        tabindex="0"
      >
        {#if droppedFileName}
          <div class="flex flex-col gap-1 justify-center items-center">
            <p
              class="w-100 flex items-center justify-center align-middle text-red-400 font-semibold"
            >
              {droppedFileName}
            </p>
            <p class="w-100 flex justify-center items-center align-middle">
              Click to select another file
            </p>
          </div>
        {:else}
          <p>Drag 'n' drop mp3 file here, or click to select a file</p>
        {/if}
      </div>
      <input
        type="file"
        id="fileInput"
        on:change={handleFileSelect}
        accept=".mp3"
        multiple
        hidden
      />
    </div>
    <div class="flex justify-center items-center gap-5">
      <button
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
        on:click={handleTranscribe}
      >
        Transcribe
      </button>
      <button
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded dis disabled:opacity-50 disabled:cursor-not-allowed"
        disabled
      >
        Sumarize
      </button>
    </div>
    {#if data && !isLoading && !hasError}
      <div
        id="Transcription"
        class="w-full min-h-[200px] relative border-solid border-emerald-600 border-2 flex justify-center items-center rounded-lg p-3 pb-6"
      >
        <p class="text-emerald-200 font-semibold">{data}</p>
        <p
          class="absolute right-2 top-[-15px] h-fit w-[150px] flex justify-center bg-white text-emerald-600 font-bold"
        >
          Confidence : {confidence.toFixed(0)}%
        </p>
        <p
          class="absolute left-2 top-[-15px] h-fit w-[110px] flex justify-center bg-white text-emerald-600 font-semibold"
        >
          Transcription
        </p>
        <button
          class="absolute bottom-[-20px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
          on:click={handleOpenEmailBox}
        >
          Send by email
        </button>
      </div>
    {:else if !data && !isLoading && !hasError}
      <div
        id="Transcription"
        class="w-full relative min-h-[200px] border-solid border-emerald-600 border-2 flex justify-center items-center align-middle rounded-lg p-3"
      >
        <p class="text-emerald-600 font-semibold">No transcription yet</p>
        <p
          class="absolute left-2 top-[-15px] h-fit w-[110px] flex justify-center bg-white text-emerald-600 font-semibold"
        >
          Transcription
        </p>
      </div>
    {:else if hasError && !isLoading && !data}
      <div
        id="Transcription"
        class="w-full relative min-h-[200px] border-solid border-emerald-600 border-2 flex justify-center items-center align-middle rounded-lg p-3"
      >
        <p class="text-emerald-600 font-semibold">An error occurred</p>
        <p
          class="absolute left-2 top-[-15px] h-fit w-[110px] flex justify-center bg-white text-emerald-600 font-semibold"
        >
          Transcription
        </p>
      </div>
    {:else if !hasError && isLoading && !data}
      <div
        id="Transcription"
        class="w-full relative min-h-[200px] border-solid border-emerald-600 border-2 flex justify-center items-center align-middle rounded-lg p-3"
      >
        <p class="text-emerald-600 font-semibold">Loading ...</p>
        <p
          class="absolute left-2 top-[-15px] h-fit w-[110px] flex justify-center bg-white text-emerald-600 font-semibold"
        >
          Transcription
        </p>
      </div>
    {/if}
  </div>
</main>

{#if isEmailBoxOpen}
  <Box on:close={handleOpenEmailBox} on:submit={sendEmail} />
{/if}

<Recorder on:audioRecorded={handleSelectedAudio} />

<style>
  .blurClass {
    filter: blur(5px);
  }
</style>
