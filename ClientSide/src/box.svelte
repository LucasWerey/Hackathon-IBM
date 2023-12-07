<script>
  // @ts-nocheck

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const handleCrossClose = () => {
    dispatch("close");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    dispatch("submit", { email });
  };
</script>

<div class="fixed inset-0 flex items-center justify-center flex-col gap-4">
  <div
    class="absolute z-30 bg-white shadow-lg w-[300px] h-[150px] md:w-[500px] md:h-[200px] border-solid border-2 border-emerald-400 p-2 flex gap-2 flex-col"
  >
    <div id="crossClose" class="absolute md:top-0 top-[-10px] right-[-10px]">
      <button
        class=" text-emerald-400 font-bold py-2 px-4 rounded-full"
        on:click={handleCrossClose}
      >
        X
      </button>
    </div>
    <h1
      class="flex items-center w-100 justify-center font-semibold text-xl md:text-3xl gap-1"
    >
      <span class="text-emerald-400 font-bold">Send</span><span>by</span><span
        >email</span
      >
    </h1>
    <form
      class="flex flex-col gap-4 align-middle justify-center items-center h-3/4"
      on:submit={handleSubmit}
    >
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email"
        class="border-solid border-2 border-emerald-400 w-3/4 md:h-1/6 h-1/3"
      />
      <button
        type="submit"
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded w-3/5 md:h-1/6 h-1/3 flex items-center justify-center align-middle"
      >
        Send
      </button>
    </form>
  </div>
</div>
