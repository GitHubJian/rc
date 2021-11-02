import fs from 'fs';
import cloneDeep from 'lodash.clonedeep';
import getRcPath from './rc-path';

export function create(name, defaults = {}) {
    let rcPath = getRcPath(name);
    
    let cachedOptions;
    function load() {
        if (cachedOptions) {
            return cachedOptions;
        }
        if (fs.existsSync(rcPath)) {
            try {
                cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
            } catch (e) {
                console.error(
                    `Error loading saved preferences: ` +
                        `~/.${name}rc may be corrupted or have syntax errors. ` +
                        `(${(e as Error).message})`
                );
                process.exit(1);
            }
            return cachedOptions;
        } else {
            return {};
        }
    }

    function save(toSave = {}) {
        const options = Object.assign(cloneDeep(load()), toSave);

        if (defaults) {
            for (const key in options) {
                if (!(key in defaults)) {
                    delete options[key];
                }
            }
        }

        cachedOptions = options;
        try {
            fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
            return true;
        } catch (e) {
            console.error(
                `Error saving preferences: ` +
                    `make sure you have write access to ${rcPath}.\n` +
                    `(${(e as Error).message})`
            );
        }
    }

    return {
        load,
        save,
    };
}

export const rc = create('defaults', {});
