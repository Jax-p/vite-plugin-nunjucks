import * as path from 'path';
import nunjucks, {Environment} from 'nunjucks';
import {HmrContext, IndexHtmlTransformContext, IndexHtmlTransformResult, Plugin} from "vite";
import {nunjucksEnvironmentOptions, nunjucksFilterCallback, nunjucksPluginOptions} from "./types";
import {defaultConfigureOptions, defaultPluginOptions} from "./defaults";

export const globalVariablesKey = '*';

export default (options: nunjucksPluginOptions = {}): Plugin => {
    const env = options.nunjucksEnvironment instanceof Environment
        ? options.nunjucksEnvironment
        : createNunjucksEnvironment(options.nunjucksEnvironment || {});

    return {
        name: 'nunjucks',
        enforce: 'pre',
        handleHotUpdate: handleHotUpdate,
        transformIndexHtml: {
            enforce: 'pre',
            transform: handleTransformHtml
        }
    }

    function createNunjucksEnvironment({extensions, filters}: nunjucksEnvironmentOptions): Environment {
        options = {...defaultPluginOptions, ...options};
        const env = nunjucks.configure({
            ...defaultConfigureOptions,
            ...(options.nunjucksConfigure||{})
        });
        Object.keys(extensions||{}).forEach(name => env.addExtension(name, extensions[name]));
        Object.keys(filters||{}).forEach(name => {
            const filter = filters[name];
            (typeof filter === 'object' && filter.hasOwnProperty('filter'))
                ? env.addFilter(name, filter.filter, filter.async)
                : env.addFilter(name, filter as nunjucksFilterCallback)
        });
        return env;
    }

    function handleTransformHtml(html: string, context: IndexHtmlTransformContext): IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void> {
        const key = path.basename(context.path);
        const globalVariables = options.variables?.[globalVariablesKey] || {};
        const templateVariables = options.variables?.[key] || {};
        return new Promise((resolve, reject) => {
            env.renderString(html, {...globalVariables, ...templateVariables}, function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });    
        });
    }

    function handleHotUpdate(context: HmrContext): void|[] {
        const filename = path.resolve(context.file)
        if (!filename.startsWith(options.templatesDir)) return;
        console.info(`Template file ${path.basename(filename)} has been changed. Sending full-reload.`);
        context.server.ws.send({type: 'full-reload'});
        return []
    }
}
