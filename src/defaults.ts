import {ConfigureOptions} from "nunjucks";
import * as path from "path";
import {nunjucksPluginOptions} from "./types";

export const defaultConfigureOptions: ConfigureOptions = {
    noCache: true
}

export const defaultPluginOptions: nunjucksPluginOptions = {
    templatesDir: path.resolve(process.cwd(), 'src', 'html'),
    nunjucksConfigure: defaultConfigureOptions
}
