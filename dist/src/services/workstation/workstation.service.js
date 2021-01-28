"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$workstation = exports.WorkstationService = exports.WORKSTATION_TYPES_MAP = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = require("fs");
const utils_1 = require("../../utils");
const vue_1 = require("./proxys/vue");
exports.WORKSTATION_TYPES_MAP = {
    vue: true,
    angular: true,
    react: true,
};
class WorkstationService {
    constructor() {
        this.configPath = '';
    }
    syncConfig() {
        return new Promise((resolve) => {
            if (!utils_1.getRootPath()) {
                console.log(chalk_1.default.red('The ops cli requires to be run in an Octopus workstation, but a workstation definition could not be found.'));
                return resolve(false);
            }
            if (!this.configPath) {
                this.configPath = utils_1.formRoot('workstation.json');
            }
            if (fs_1.existsSync(this.configPath)) {
                this.config = require(this.configPath);
            }
            if (!this.config) {
                this.config = {
                    name: utils_1.getWorkstationDirname(),
                    type: '',
                    projects: {},
                };
            }
            fs_1.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            resolve(true);
        });
    }
    create(name, type) {
        switch (type) {
            case "vue":
                return new vue_1.VueWorkstationCreator(name).create();
        }
    }
    addProject(name) {
    }
    renameProject(name) {
    }
    removeProject(name) {
    }
}
exports.WorkstationService = WorkstationService;
exports.$workstation = new WorkstationService();
//# sourceMappingURL=workstation.service.js.map