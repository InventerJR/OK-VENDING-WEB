/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["echarts", "zrender"],
	webpack(config, { isServer }) {
		if (isServer) {
			config.resolve.alias.canvas = false;
		}
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: [
				{
					loader: "@svgr/webpack",
					options: {
						replaceAttrValues: { "#000": "currentColor" },
						prettier: false,
						svgo: true,
						svgoConfig: {
							plugins: [
								{
									name: "preset-default",
									params: {
										overrides: { removeViewBox: false },
									},
								},
							],
						},
						titleProp: true,
						typescript: true,
					},
				},
			],
		});

		return config;
	},
};

module.exports = nextConfig;
