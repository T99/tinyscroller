module.exports = {
	
	env: {
		
		browser: true,
		
		es6: true,
		
	},
	
	"extends": [
		
		"@t99",
		
	],
	
	overrides: [
		
		{
			files: [
				
				".eslintrc.js",
				
				"gulpfile.js",
				
			],
			
			env: {
				
				node: true,
				
			},
			
		},
		
	],
	
};
