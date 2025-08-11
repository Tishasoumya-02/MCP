// src/handlers.ts
import { ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ReadResourceRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { promptHandlers, prompts } from "./prompts.js";
import { resourceHandlers, resources } from "./resources.js";
import { getResourceTemplate, resourceTemplates, } from "./resource-templates.js";
export const setupHandlers = (server) => {
    // List available resources when clients request them
    server.setRequestHandler(ListResourcesRequestSchema, () => ({ resources }));
    // Resource Templates
    server.setRequestHandler(ListResourceTemplatesRequestSchema, () => ({
        resourceTemplates,
    }));
    // Return resource content when clients request it
    server.setRequestHandler(ReadResourceRequestSchema, (request) => {
        const { uri } = request.params ?? {};
        const resourceHandler = resourceHandlers[uri];
        if (resourceHandler)
            return resourceHandler();
        const resourceTemplateHandler = getResourceTemplate(uri);
        if (resourceTemplateHandler)
            return resourceTemplateHandler();
        throw new Error("Resource not found");
    });
    server.setRequestHandler(ListPromptsRequestSchema, () => ({
        prompts: Object.values(prompts),
    }));
    server.setRequestHandler(GetPromptRequestSchema, (request) => {
        const { name, arguments: args } = request.params;
        const promptHandler = promptHandlers[name];
        if (promptHandler)
            return promptHandler(args);
        throw new Error("Prompt not found");
    });
};
// // src/handlers.ts
// import {
//     ListResourcesRequestSchema,
//     ReadResourceRequestSchema,
//     ListResourceTemplatesRequestSchema,
// } from "@modelcontextprotocol/sdk/types.js";
// import { type Server } from "@modelcontextprotocol/sdk/server/index.js";
// import { readFileSync } from "fs";
// import { existsSync } from "fs";
// export const setupHandlers = (server: Server): void => {
//     // List available resources when clients request them
//     server.setRequestHandler(ListResourcesRequestSchema, async () => {
//         return {
//             resources: [
//                 {
//                     uri: "hello://world",
//                     name: "Hello World Message",
//                     description: "A simple greeting message",
//                     mimeType: "text/plain",
//                 },
//                 {
//                     uri: "file://aboutme",
//                     name: "About Me",
//                     description: "Personal information from AboutMe.txt",
//                     mimeType: "text/plain",
//                 },
//             ],
//         };
//     });
//     server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
//         resourceTemplates: [
//             {
//                 greetings: {
//                     uriTemplate: 'greetings://{name}',
//                     name: 'Personal Greeting',
//                     description: 'A personalized greeting message',
//                     mimeType: 'text/plain',
//                 },
//             },
//         ],
//     }));
//     // Return resource content when clients request it
//     server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
//         if (request.params.uri === "hello://world") {
//             return {
//                 contents: [
//                     {
//                         uri: "hello://world",
//                         text: "Hello, World! This is my first MCP resource.",
//                     },
//                 ],
//             };
//         }
//         if (request.params.uri === "file://aboutme") {
//             const filePath = "/Users/tishasoumya/Desktop/AboutMe.txt";
//             if (!existsSync(filePath)) {
//                 throw new Error(`File not found: ${filePath}`);
//             }
//             try {
//                 const fileContent = readFileSync(filePath, "utf-8");
//                 return {
//                     contents: [
//                         {
//                             uri: "file://aboutme",
//                             text: fileContent,
//                         },
//                     ],
//                 };
//             } catch (error) {
//                 throw new Error(`Error reading file: ${error}`);
//             }
//         }
//         // Template-based resource code
//         const greetingExp = /^greetings:\/\/(.+)$/;
//         const greetingMatch = request.params.uri.match(greetingExp);
//         if (greetingMatch) {
//             const name = decodeURIComponent(greetingMatch[1]);
//             return {
//                 contents: [
//                     {
//                         uri: request.params.uri,
//                         text: `Hello, ${name}! Welcome to MCP.`,
//                     },
//                 ],
//             };
//         }
//         throw new Error("Resource not found");
//     });
// };
