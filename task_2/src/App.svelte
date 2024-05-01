<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let currencies = [];
  let baseCurrency = "USD";
  let targetCurrency = "RUB";
  let baseAmount: number = 1;
  let targetAmount = null;
  let exchangeRate = null;
  let isLoading = false;

  async function fetchData() {
    isLoading = true;
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      const data = await response.json();
      currencies = Object.keys(data.rates);
      exchangeRate = data.rates[targetCurrency];
      updateTargetAmount();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  }

  onMount(fetchData);

  function handleBaseCurrencyChange(event) {
    baseCurrency = event.target.value;
    fetchData();
  }

  function handleTargetCurrencyChange(event) {
    targetCurrency = event.target.value;
    fetchData();
  }

  function handleBaseAmountChange(event) {
    baseAmount = event.target.value;
    updateTargetAmount();
  }

  function handleTargetAmountChange(event) {
  targetAmount = event.target.value;
  baseAmount =
    exchangeRate !== null
      ? parseFloat(targetAmount) / exchangeRate
      : null;
}

  function updateTargetAmount() {
    targetAmount =
      exchangeRate !== null ? (baseAmount * exchangeRate).toFixed(2) : null;
  }

  function swapCurrencies() {
    const temp = baseCurrency;
    baseCurrency = targetCurrency;
    targetCurrency = temp;
    fetchData();
  }

  $: dispatch("conversion", {
    baseCurrency,
    targetCurrency,
    baseAmount,
    targetAmount,
  });
</script>

<main>
  <h1>Конвертер</h1>

  <div class="boxValues">
    <select
      class="baseCurrency"
      id="baseCurrency"
      bind:value={baseCurrency}
      on:change={handleBaseCurrencyChange}
    >
      {#each currencies as currency}
        <option value={currency}>{currency}</option>
      {/each}
    </select>
    <select
      class="targetCurrency"
      id="targetCurrency"
      bind:value={targetCurrency}
      on:change={handleTargetCurrencyChange}
    >
      {#each currencies as currency}
        <option value={currency}>{currency}</option>
      {/each}
    </select>

    <input
      type="number"
      id="baseAmount"
      value={baseAmount}
      on:input={handleBaseAmountChange}
    />

    {#if isLoading}
      <input type="text" id="targetAmount" value={"Загрузка..."} disabled />
    {:else}
      <input
        type="number"
        id="targetAmount"
        value={targetAmount}
        on:input={handleTargetAmountChange}
      />
    {/if}
  </div>
  <svg
    class="arrows"
    on:click={swapCurrencies}
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="100.000000pt"
    height="100.000000pt"
    viewBox="0 0 100.000000 100.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g transform="scale(0.100000,0.100000)" fill="#353743 " stroke="none">
      <path
        class="arrow-path"
        d="M722 988 c-25 -25 -11 -54 53 -118 l66 -65 -412 -5 c-378 -5 -413 -6 -423 -22 -8 -13 -8 -23 0 -35 10 -17 45 -18 423 -23 l412 -5 -66 -65 c-66 -65 -79 -96 -50 -120 8 -6 22 -9 32 -6 10 3 70 58 133 121 l115 115 -121 120 c-66 66 -127 120 -135 120 -8 0 -20 -5 -27 -12z"
      />
      <path
        class="arrow-path"
        d="M118 362 l-120 -118 121 -122 c67 -67 127 -122 134 -122 19 0 37 21 37 45 0 12 -27 47 -65 85 l-66 65 412 5 c378 5 413 6 423 23 8 12 8 22 0 35 -10 16 -45 17 -423 22 l-412 5 66 65 c64 64 78 93 53 118 -7 7 -18 12 -26 12 -8 0 -68 -53 -134 -118z"
      />
    </g>
  </svg>
</main>
