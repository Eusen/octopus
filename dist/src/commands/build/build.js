"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const workstation_service_1 = require("../../services/workstation/workstation.service");
const project_service_1 = require("../../services/project/project.service");
const common_1 = require("../common");
exports.default = {
    install(program) {
        program
            .command(`build [project]`)
            .description(chalk_1.default.yellowBright('Build a project in production mode.'))
            .action(async (project) => {
            await workstation_service_1.$workstation.syncConfig();
            if (!project)
                project = await common_1.selectProject();
            return project_service_1.$project.build(project);
        });
    }
};
//# sourceMappingURL=build.js.map