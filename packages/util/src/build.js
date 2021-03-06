// @flow
// Script to build and run production.

import colors from 'colors'
import shell from 'shelljs'
import babelDir from './babel-dir'
import checkPackage from './checkPackage'
import appRoot from './root'

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason) // eslint-disable-line no-console
    // application specific logging, throwing an error, or other logic here
})

const pre = colors.green('[deuterium/util]')

export const removeDir = (dir: string) => {
    shell.rm('-rf', dir)
    console.log(`${pre} Removed ${dir}.`)
}

export const babelifyDir = async (
    src: string,
    dest: string,
    options: Object
) => {
    await babelDir(src, dest, options)
    console.log(`${pre} Babelified ${src} into ${dest}.`)
}

export const initWebpack = (config: Object) => {
    // Requires webpack and @babel/polyfill
    checkPackage('webpack', true)

    // flow-disable-next-line
    const webpack = require(`${appRoot}/node_modules/webpack`) // eslint-disable-line

    checkPackage('@babel/polyfill', true)

    webpack(config, (err, stats) => {
        if (err) {
            console.error(err.stack || err)
            if (err.details) console.error(`${pre} ${err.details}`)
            return
        }
        if (stats.hasErrors()) {
            console.error(stats.toJson().errors)
            return
        }
        if (stats.hasWarnings()) console.warn(stats.toJson().warnings)
        console.log(`${pre} Webpack created.`)
    })
}

export const build = (
    src: string,
    lib: string,
    babelOptions: Object,
    webpackConfig: Object
) => {
    console.log(`${pre} Starting build.`)
    removeDir(lib)
    babelifyDir(src, lib, babelOptions)
    initWebpack(webpackConfig)

    console.log(`${pre} Build complete.`)
}
