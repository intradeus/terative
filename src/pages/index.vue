<template>
	<div relative overflow-hidden px-6 lg="px-8">
		<div grid mx-auto h-screen max-w-2xl place-content-center>
			<SvgoLogo :filled="true" :font-controlled="false" mx-auto mb-8 size-40 />

			<div text-center>
				<h1 animate-pulse text-4xl text-light-300 font-bold tracking-wider font-heading sm="text-6xl">
					{{ name.toUpperCase() }}
				</h1>
			</div>
		</div>

		<div fixed bottom-6 text-sm absolute-center-h>
			<p text-sm text-neutral-500>
				Made by {{ author }}
			</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { SettingsService } from "~/tauri-api/settings";

	const { name, author } = useConstants();

	definePageMeta({
		layout: "home"
	});
	const service = await SettingsService();
	service.helloWorld();
</script>
