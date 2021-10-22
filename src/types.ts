import {ConfigureOptions, Environment, Extension} from "nunjucks";

export type templateVariables = Record<string, object>

export interface nunjucksPluginOptions {
    templatesDir?: string,
    variables?: templateVariables,
    nunjucksConfigure?: ConfigureOptions,
    nunjucksEnvironment?: nunjucksEnvironmentOptions | Environment
}

export type nunjucksFilterCallback = (...params) => void;
export interface nunjucksFilter {
    async: boolean,
    filter: nunjucksFilterCallback
}

export interface nunjucksEnvironmentOptions {
    filters?: {[key: string]: nunjucksFilterCallback | nunjucksFilter },
    extensions?: {[key: string]: Extension}
}

