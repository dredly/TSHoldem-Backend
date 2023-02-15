import { isClientMessage } from "./typeGuards"
import { ClientMessage } from "./types"

export const parseClientMessage = (message: unknown): ClientMessage => {
    if (!message || !isClientMessage(message)) {
        throw new Error("Invalid format for client message")
    }
    return message
}