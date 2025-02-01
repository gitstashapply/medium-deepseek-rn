import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { loadModel } from "../llama/llama.config";
import Chat from "@/components/Chat";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LlamaContext } from "llama.rn";

const downloadLink =
    "https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q5_K_M.gguf";

export default () => {
    const [context, setContext] = useState<LlamaContext | null | undefined>(
        null,
    );

    const downloadResumable = FileSystem.createDownloadResumable(
        downloadLink,
        FileSystem.documentDirectory + "model.gguf",
        {},
        (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite;
            console.log(progress);
        },
    );

    const downloadModel = async () => {
        try {
            const isExists = (await FileSystem.getInfoAsync(
                FileSystem.documentDirectory + "model.gguf",
            )).exists;
            if (isExists) {
                const context = await loadModel(
                    FileSystem.documentDirectory + "model.gguf",
                );
                setContext(context);

                return;
            }

            const res = await downloadResumable.downloadAsync();
            console.log("Finished downloading to ", res?.uri);

            if (!res?.uri) {
                console.log("no uri");
            }

            const context = await loadModel(res?.uri!);
            setContext(context);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        downloadModel();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 4 }}>
                {context && <Chat context={context} />}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};
