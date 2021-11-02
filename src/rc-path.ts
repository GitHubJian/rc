import path from 'path';
import os from 'os';
import fs from 'fs-extra';

function xdgConfigPath(moduleName) {
    const xdgConfigHome = process.env.XDG_CONFIG_HOME;
    if (xdgConfigHome) {
        const rcDir = path.join(xdgConfigHome, moduleName);
        if (!fs.existsSync(rcDir)) {
            fs.ensureDirSync(rcDir, 0o700);
        }

        return path.join(rcDir, `.${moduleName}rc`);
    }
}

function migrateWindowsConfigPath(moduleName) {
    if (process.platform !== 'win32') {
        return;
    }

    const appData = process.env.APPDATA;
    if (appData) {
        const rcDir = path.join(appData, moduleName);
        const rcFile = path.join(rcDir, `.${moduleName}rc`);
        const properRcFile = path.join(os.homedir(), rcFile);
        if (fs.existsSync(rcFile)) {
            try {
                if (fs.existsSync(properRcFile)) {
                    fs.removeSync(rcFile);
                } else {
                    fs.removeSync(rcFile, properRcFile);
                }
            } catch (e) {}
        }
    }
}

export default function getRcFile(moduleName) {
    migrateWindowsConfigPath(moduleName);

    return (
        process.env.CLI_CONFIG_PATH ||
        xdgConfigPath(moduleName) ||
        path.join(os.homedir(), `.${moduleName}rc`)
    );
}
