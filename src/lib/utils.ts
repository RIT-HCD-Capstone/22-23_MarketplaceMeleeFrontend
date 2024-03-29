import { goto } from '$app/navigation';
import type { ClientResponse, MessageFromServer, Player, YearlyEvent } from './types';
import { base } from '$app/paths';
import type Item from './types';

export const SOCKET_URL: string = 'wss://hcd-lab.student.rit.edu/socket';
export const DEV_SOCKET_URL: string = 'ws://127.0.0.1:3883/socket';
export const DEV_TS_SOCKET_URL: string = 'ws://100.114.57.112:3883/socket';

/** Works only in browser */
export function Connect(): WebSocket {
	// return new WebSocket(DEV_TS_SOCKET_URL);
	//return new WebSocket(DEV_SOCKET_URL)
	return new WebSocket(SOCKET_URL);
}

/** Works only in browser. Sends a message to the server. */
export function SendMessage(
	socket: WebSocket,
	message: string | ArrayBufferLike | Blob | ArrayBufferView
) {
	socket.send(message);
	console.log('message sent to server: ' + message);
}

export function clientDie() {
	goto(`${base}/dead`);
}

/** Parses messages recieved from the server. */
export function ParseServerMessage(message: MessageEvent): ClientResponse {
	let stringMessage = message.data.toString();
	let messageData = stringMessage.split('$$');
	switch (<MessageFromServer>messageData[1]) {
		case 'clientConnected':
			return { serverMessage: messageData[1], clientId: messageData[2] };
		/** returns the name of the newPlayer, the client. */
		case 'newPlayer':
			return { serverMessage: messageData[1] };
		/** retuns an array of all players. */
		case 'allPlayers':
			console.log(messageData[2]);
			console.log(JSON.parse(messageData[2]));
			return { serverMessage: messageData[1], allPlayers: <Player[]>JSON.parse(messageData[2]) };
		/** returns an array of 3 items to be displayed in the shop */
		case 'shopItems':
			console.log('shopItems')
			console.log(messageData[2]);
			console.log(JSON.parse(messageData[2]));
			return { serverMessage: messageData[1], items: <Item[]>JSON.parse(messageData[2]) };
		case 'playerDeath':
			console.log(messageData[2]);
			console.log(JSON.parse(messageData[2]));
			return { serverMessage: messageData[1], deadPlayers: <Player[]>JSON.parse(messageData[2]) };
		case 'event':
			console.log(messageData[2]);
			console.log(JSON.parse(messageData[2]));
			return { serverMessage: messageData[1], yearlyEvent: <YearlyEvent>JSON.parse(messageData[2]) };
		case 'gameCreated':
			return { serverMessage: messageData[1] };
		case 'gameEvent':
			goto(`${base}/event`);
			return { serverMessage: messageData[1] };
		case 'gameCalculate':
			// TODO an animation? call that a stretch goal, but do something when the server calculates
			return { serverMessage: messageData[1] };
		case 'gameShop':
			goto(`${base}/shop`);
			return { serverMessage: messageData[1] };
		case 'gameMove':
			goto(`${base}/move`);
			return { serverMessage: messageData[1] };
		case 'gameStance':
			goto(`${base}/stance`);
			return { serverMessage: messageData[1] };
		case 'gameResolve':
			// TODO show a leaderboard page? just move to next turn? not sure
			goto(`${base}/event`);
			return { serverMessage: messageData[1] };
		default:
			return { serverMessage: messageData[0] }
	}
}
