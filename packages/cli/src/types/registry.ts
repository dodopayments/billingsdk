import { SupportedFramework } from "../config/matrix.js";

export interface BackendComponent {
    name: string;
    description: string;
    framework: SupportedFramework;
    files: Array<{
        path: string;
        content: string;
        target: string;
        type: "template" | "config" | "types";
    }>;
    dependencies?: string[];
}

export interface Registry {
    $schema: string;
    components: BackendComponent[];
}

export interface Result {
    name: string;
    description: string;
    framework: SupportedFramework;
    files: Array<{
        content: string;
        target: string;
        type: "template" | "config" | "types";
    }>;
    dependencies?: string[];
}