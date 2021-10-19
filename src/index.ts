import * as path from 'path';
import {HmrContext, IndexHtmlTransformContext} from "vite";
import nunjucks, {renderString} from 'nunjucks';
import {nunjucksPluginOptions} from "./types";
import {defaultConfigureOptions, defaultPluginOptions} from "./defaults";

export default (options: nunjucksPluginOptions = {}) => {
    options = {...defaultPluginOptions, ...options};
    nunjucks.configure({
        ...defaultConfigureOptions,
        ...(options.nunjucksConfigure||{})
    });

    return {
        name: 'nunjucks',
        enforce: 'pre',
        handleHotUpdate: handleHotUpdate,
        transformIndexHtml: {
            enforce: 'pre',
            transform: handleTransformHtml
        }
    }

    function handleTransformHtml(html: string, context: IndexHtmlTransformContext) {
        const key = path.basename(context.path);
        return renderString(html, options.variables?.[key] || {});
    }

    function handleHotUpdate(context: HmrContext): void|[] {
        const filename = path.resolve(context.file)
        if (!filename.startsWith(options.templatesDir)) return;
        console.info(`Template file ${path.basename(filename)} has been changed. Sending full-reload.`);
        context.server.ws.send({type: 'full-reload'});
        return []
    }
}
