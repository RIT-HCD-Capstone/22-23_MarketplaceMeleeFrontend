<script lang="ts">
	import { SendMessage } from '$lib/utils';
	import { id, thisPlayer, allPlayers, connection, shopItems, pageName } from '$lib/stores';
	import LoadingPopUp from '$lib/LoadingPopUp.svelte';
	import ItemCard from '$lib/ItemCard.svelte';
	import PlayerStats from '$lib/PlayerStats.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	/** the name of the item being purchased */
	let itemName: string;

	let loading: boolean = false;

	function toggleLoading(): void {
		loading = loading ? false : true;
	}
</script>

<main class=" bg-gradient-to-b from-[#631D73] to-white min-h-screen relative">
	<LoadingPopUp show={loading} />
	<div class="box z-10 min-h-screen h-full">
		<div class="flex flex-col justify-center w-full items-center p-4 min-h-screen h-full z-20">
			<div class="border-2 border-black w-[300px] p-2 outer mb-4 bg-white">
				<div
					class=" box border-2 border-black flex justify-center p-1"
					style="background-color: #631D73  ;"
				>
					<h1 class="text-4xl text-white text-style">Shop</h1>
				</div>
			</div>
			<PlayerStats />
			<div
				class=" whitespace-nowrap overflow-y-hidden overflow-x-scroll w-[330px] inline-flex scrollbar-hide relative translate-x-[15px]"
			>
				{#if $shopItems?.length > 0}
					{#each $shopItems as item}
						<ItemCard
							itemName={item.name}
							itemDescription={item.description}
							itemEffect={item.effect}
							itemPrice={item.price}
							itemRarity={item.rarity}
							isConsumable={item.consumable}
						/>
					{/each}
				{/if}
			</div>

			<button
				class="border-2 border-black w-[300px] p-2 outer my-2 bg-white rounded-md"
				on:click={() => {
					SendMessage($connection, 'CLIENT$$' + $id + '$$requestNewItems');
				}}
				on:keypress={() => {
					SendMessage($connection, 'CLIENT$$' + $id + '$$requestNewItems');
				}}
			>
				<div
					class=" box border-2 border-black flex justify-center p-1 items-center"
					style="background-color: #631D73  ;"
				>
					<h1 class="text-4xl text-white text-style">
						Reroll <span class="text-2xl">(5 value)</span>
					</h1>
				</div>
			</button>
			<button
				class="border-2 border-black w-[300px] p-2 outer my-3 bg-white rounded-md"
				on:click={() => {
					$pageName = 'shop';
					goto(`${base}/inventory`);
				}}
			>
				<div
					class=" box border-2 border-black flex justify-center p-1"
					style="background-color: #D9D9D9 ;"
				>
					<h1 class="text-4xl text-white text-style">Inventory</h1>
				</div>
			</button>

			<button
				class="border-2 border-black w-[300px] p-2 outer my-2 bg-white rounded-md"
				on:click={() => {
					SendMessage($connection, 'CLIENT$$' + $id + '$$ready');
					toggleLoading();
					SendMessage($connection, 'CLIENT$$' + $id + '$$doneShopping');
				}}
				on:keypress={() => {
					SendMessage($connection, 'CLIENT$$' + $id + '$$ready');
					toggleLoading();
					SendMessage($connection, 'CLIENT$$' + $id + '$$doneShopping');
				}}
			>
				<div
					class=" box border-2 border-black flex justify-center p-1"
					style="background-color: #205295  ;"
				>
					<h1 class="text-4xl text-white text-style">done shopping</h1>
				</div>
			</button>
		</div>
	</div>
</main>
