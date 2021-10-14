import {ConfigureOptions} from "nunjucks";

export type templateVariables = Record<string, object>

export interface nunjucksPluginOptions {
    templatesDir?: string,
    variables?: templateVariables,
    nunjucksConfigure?: ConfigureOptions
}
