import { WorkstationCreatorBase } from './_base';
export declare class VueWorkstationCreator extends WorkstationCreatorBase {
    create(): Promise<void>;
    initMainProject(): Promise<void>;
    createVueConfigFile(): Promise<void>;
}
