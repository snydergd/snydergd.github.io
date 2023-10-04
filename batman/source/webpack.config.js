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
            publicPath: "/source/dist/",
        },
        resolve: {
            fallback: {
                "fs": false,
                "tls": false,
                "net": false,
                "path": false,
                "zlib": false,
                "http": false,
                "https": false,
                "stream": false,
                "crypto": false,
                "url": false,
            },
        },
    };

    if (env.WEBPACK_SERVE) {
      config.devtool = "inline-source-map";
    }

    return config;
};
