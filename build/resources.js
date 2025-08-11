import { readFileSync } from "fs";
import { existsSync } from "fs";
export const resources = [
    {
        uri: "hello://world",
        name: "Hello World Message",
        description: "A simple greeting message",
        mimeType: "text/plain",
    },
    {
        uri: "file://aboutme",
        name: "About Me",
        description: "Personal information from AboutMe.txt",
        mimeType: "text/plain",
    },
];
export const resourceHandlers = {
    "hello://world": () => ({
        contents: [
            {
                uri: "hello://world",
                text: "Hello, World! This is my first MCP resource.",
            },
        ],
    }),
    "file://aboutme": () => {
        const filePath = "/Users/tishasoumya/Desktop/AboutMe.txt";
        if (!existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const fileContent = readFileSync(filePath, "utf-8");
        return {
            contents: [
                {
                    uri: "file://aboutme",
                    text: fileContent,
                },
            ],
        };
    },
};
