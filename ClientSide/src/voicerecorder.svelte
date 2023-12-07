<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  // @ts-ignore
  let mediaRecorder;
  // @ts-ignore
  let chunks = [];
  let downloadUrl = "";

  const handleStartRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Recording started");

      mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // @ts-ignore
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);

        dispatch("audioRecorded", { audioBlob }); // Émettre l'événement avec les données audio

        downloadUrl = audioUrl;

        chunks = [];
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecord = () => {
    // @ts-ignore
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      console.log("Recording stopped");
    }
  };

  if (mediaRecorder) {
    // @ts-ignore
    mediaRecorder.onstop = () => {
      // @ts-ignore
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      console.log(audioUrl, "audioUrl");
      dispatch("audioRecorded", { audioUrl });

      downloadUrl = audioUrl;

      chunks = [];
    };
  }
</script>

<section class="m-5 mt-10">
  <div class="flex flex-row justify-between w-full gap-2 item-center">
    <button
      id="startRecord"
      class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded w-3/5 md:h-1/6 h-1/3 flex items-center justify-center align-middle"
      on:click={handleStartRecord}
    >
      Start recording
    </button>
    <button
      id="stopRecord"
      class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded w-3/5 md:h-1/6 h-1/3 flex items-center justify-center align-middle"
      on:click={handleStopRecord}
    >
      Stop recording
    </button>
  </div>
  {#if downloadUrl}
    <a href={downloadUrl} download="recording.webm">Download recording</a>
  {/if}
</section>
