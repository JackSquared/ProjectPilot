module.exports = {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": "frontend/tsconfig.json"
    },
    "plugins": [
      "react",
      "@typescript-eslint",
      "prettier"
    ],
    "rules": {
      "prettier/prettier": "error"
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    ignorePatterns: [".eslintrc.js"],
  }