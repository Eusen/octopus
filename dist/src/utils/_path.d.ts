/**
 * 如果返回的路径为空，则表示没有找到配置文件
 */
export declare function getRootPath(): string;
export declare function initRootPath(name: string): void;
export declare function fromRoot(...paths: string[]): string;
export declare function fromCLIRoot(...paths: string[]): string;
export declare function getWorkstationDirname(): string;
