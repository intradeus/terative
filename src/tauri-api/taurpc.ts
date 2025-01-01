import { createTauRPCProxy } from "../../bindings";

export async function useTauRpc() {
	const taurpc = await createTauRPCProxy();
	return taurpc;
}
