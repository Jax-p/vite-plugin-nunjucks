import {ConfigureOptions} from "nunjucks";
import * as path from "path";

export const defaultConfigureOptions: ConfigureOptions = {
    noCache: true
}

export const defaultPluginOptions = {
    templatesDir: path.resolve(process.cwd(), 'src', 'html'),
    nunjucksConfigure: defaultConfigureOptions
}
