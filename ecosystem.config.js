module.exports = {
    apps : [{
      name: 'mj',
      script: './dist/main.js',
      instances : 'max',
      exec_mode : "cluster",
      watch: '.',
        ignore_watch : ["node_modules"],
      env: {
        NODE_ENV: "development"
      },
      env_development: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  };
  