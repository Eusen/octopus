import ChainableConfig from 'webpack-chain';
import { Configuration } from 'webpack-dev-server';
import { Filter as HttpProxyFilter, Options as HttpProxyOptions } from 'http-proxy-middleware';
import { ProjectConfig } from '../project.service';
export interface VuePageConfig {
    entry?: string;
    template?: string;
    filename?: string;
    title?: string;
    chunks?: string[];
}
export interface VueCssConfig {
    requireModuleExtension?: boolean;
    extract?: boolean;
    sourceMap?: boolean;
    loaderOptions?: {
        [key: string]: any;
    };
}
export interface VuePwaConfig {
    name?: string;
    themeColor?: string;
    msTileColor?: string;
    appleMobileWebAppCapable?: string;
    appleMobileWebAppStatusBarStyle?: string;
    workboxPluginMode?: 'InjectManifest' | 'GenerateSW';
    workboxOptions?: any;
}
export interface VueProjectConfig extends ProjectConfig {
    publicPath?: string;
    outputDir?: string;
    assetsDir?: string;
    indexPath?: string;
    filenameHashing?: boolean;
    pages?: {
        [key: string]: VuePageConfig | string;
    };
    lintOnSave?: boolean;
    runtimeCompiler?: boolean;
    transpileDependencies?: (string | RegExp)[];
    productionSourceMap?: boolean;
    crossorigin?: string;
    integrity?: boolean;
    configureWebpack?: any;
    chainWebpack?: (config: ChainableConfig) => void;
    css?: VueCssConfig;
    devServer?: Configuration & {
        proxy?: HttpProxyFilter | HttpProxyOptions;
    };
    parallel?: boolean;
    pwa?: VuePwaConfig;
    pluginOptions?: {
        [key: string]: any;
    };
}
export declare function createVueProjectConfig(config: VueProjectConfig): VueProjectConfig;
