import { initLlama, LlamaContext } from "llama.rn";

export const stopWords = [
    "</s>",
    "<|end|>",
    "<|eot_id|>",
    "<|end_of_text|>",
    "<|im_end|>",
    "<|EOT|>",
    "<|END_OF_TURN_TOKEN|>",
    "<|end_of_turn|>",
    "<|endoftext|>",
];

export const loadModel = async (modelPath: string) => {
    const context = await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 131072,
        n_gpu_layers: 1, // > 0: enable Metal on iOS
        // embedding: true, // use embedding
    });

    return context;
};

export const sendMessage = async (context: LlamaContext, message: string) => {
    const msgResult = await context.completion(
        {
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            n_predict: 1000,
            stop: stopWords,
        },
        (data) => {
            const { token } = data;
        },
    );

    return msgResult.text;
};
