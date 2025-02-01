import { sendMessage } from "@/llama/llama.config";
import { LlamaContext } from "llama.rn";
import React, { useCallback, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { v4 as uuid } from "uuid";

export default ({ context }: { context: LlamaContext }) => {
    const [messages, setMessages] = useState([]);

    const createCompletion = async (message: string) => {
        const text = await sendMessage(context, message);

        const messObj = {
            _id: uuid(),
            createdAt: Date.now(),
            text,
            user: {
                _id: 0,
            },
        };

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [messObj])
        );
    };

    const onSend = useCallback(async (messages: any) => {
        const m = [...messages];

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, m)
        );

        await createCompletion(messages[0].text);
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    );
};
