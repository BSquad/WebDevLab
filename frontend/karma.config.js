module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-jasmine-html-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            jasmine: {
                random: false, // Tests in Reihenfolge ausführen
            },
            clearContext: false, // Jasmine HTML Reporter anzeigen
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'], // oder 'Chrome'
        singleRun: false,
        restartOnFileChange: true,
    });
};
