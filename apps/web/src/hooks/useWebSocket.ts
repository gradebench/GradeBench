import { useEffect, useRef, useState } from "react";

interface WebSocketMessage {
	type: "digitization_complete" | "evaluation_complete" | "status_update";
	testId: string;
	paperId?: string;
	status?: string;
	message?: string;
}

export function useWebSocket(
	testId: string,
	onMessage?: (data: WebSocketMessage) => void,
) {
	const [isConnected, _setIsConnected] = useState(false);
	const _wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		const pollInterval = setInterval(() => {
			if (onMessage) {
				onMessage({
					type: "status_update",
					testId,
					status: "polling",
				});
			}
		}, 10000);

		return () => clearInterval(pollInterval);
	}, [testId, onMessage]);

	return { isConnected };
}
