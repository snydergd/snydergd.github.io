const path = require("path");

module.exports = (env) => {
    const config = {
        devServer: {
            static: {
                directory: path.join(__dirname, ".."),
            },
            host: "0.0.0.0",
            allowedHosts: "all",
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
            ],
        },
        output: {
            publicPath: env.WEBPACK_SERVE ? "/source/dist/" : "./source/dist/",
        },
    };

    if (env.WEBPACK_SERVE) {
      config.devtool = "inline-source-map";
    }

    return config;
};
