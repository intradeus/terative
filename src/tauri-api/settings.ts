import { useTauRpc } from "./taurpc";

export const SettingsService = async () => {
	const taurpc = await useTauRpc();

	const helloWorld = async () => {
		return await taurpc.hello_world();
	};

	return {
		helloWorld
	};
};
