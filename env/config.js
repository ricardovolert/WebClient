const extend = require('lodash/extend');
const argv = require('minimist')(process.argv.slice(2));
const CONFIG_DEFAULT = require('./configDefault');
const i18nLoader = require('../tasks/translationsLoader');

const { STATS_CONFIG, STATS_ID, NO_STAT_MACHINE, API_TARGETS, AUTOPREFIXER_CONFIG } = require('./config.constants');

const isProdBranch = (branch = process.env.NODE_ENV_BRANCH) => /-prod/.test(branch);

const getStatsConfig = (deployBranch = '') => {
    const [, host = 'dev', subhost = 'a'] = deployBranch.split('-');
    return extend({}, STATS_CONFIG[host], STATS_ID[subhost]) || NO_STAT_MACHINE;
};

const getDefaultApiTarget = () => {
    if (/webclient/i.test(__dirname)) {
        return 'prod';
    }

    if (process.env.NODE_ENV === 'dist') {
        const [, type] = (argv.branch || '').match(/\w+-(beta|prod)/) || [];
        if (type) {
            return type;
        }

        if (/red/.test(argv.branch || '')) {
            return 'dev';
        }

        return 'build';
    }

    return 'dev';
};

const isDistRelease = () => {
    return ['prod', 'beta'].includes(argv.api) || process.env.NODE_ENV === 'dist';
};

const getEnv = () => {
    if (isDistRelease()) {
        return argv.api || getDefaultApiTarget();
    }
    return argv.api || 'local';
};

const apiUrl = (type = getDefaultApiTarget(), branch = '') => {
    // Cannot override the branch when you deploy to live
    if (isProdBranch(branch)) {
        return API_TARGETS.build;
    }
    return API_TARGETS[type] || API_TARGETS.dev;
};

const getHostURL = (encoded) => {
    // on local env is undefined
    const host = (isProdBranch() ? API_TARGETS.prod : process.env.NODE_ENV_API || apiUrl()).replace(/\api$/, '');
    const url = `${host}assets/host.png`;

    if (encoded) {
        const encoder = (input) => `%${input.charCodeAt(0).toString(16)}`;
        return url
            .split('/')
            .map((chunk) => {
                if (['/', 'https:'].includes(chunk)) {
                    return chunk;
                }
                return chunk
                    .split('')
                    .map(encoder)
                    .join('');
            })
            .join('/');
    }
    return url;
};

const getConfig = (env = process.env.NODE_ENV) => {
    const CONFIG = extend({}, CONFIG_DEFAULT, {
        debug: env === 'dist' ? false : 'debug-app' in argv ? argv['debug-app'] : true,
        apiUrl: apiUrl(argv.api, argv.branch),
        app_version: argv['app-version'] || CONFIG_DEFAULT.app_version,
        api_version: `${argv['api-version'] || CONFIG_DEFAULT.api_version}`,
        articleLink: argv.article || CONFIG_DEFAULT.articleLink,
        changelogPath: env === 'dist' ? CONFIG_DEFAULT.changelogPath : 'changelog.tpl.html',
        statsConfig: getStatsConfig(argv.branch)
    });

    return extend({ CONFIG }, { branch: argv.branch });
};

module.exports = {
    AUTOPREFIXER_CONFIG,
    getConfig,
    isDistRelease,
    getI18nMatchFile: i18nLoader.getI18nMatchFile,
    argv,
    getEnv,
    getHostURL
};
