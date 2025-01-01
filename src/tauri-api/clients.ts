import type { ClientMutableProps } from "~~/bindings";
import { useTauRpc } from "./taurpc";

export const ClientsService = async () => {
	const taurpc = await useTauRpc();

	const addClient = async (client: ClientMutableProps) => {
		return await taurpc.add_client(client);
	};

	return {
		addClient
	};
};
