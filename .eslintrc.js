module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
        "space-before-function-paren": ["error", "never"],
        "brace-style": ["error", "allman"],
        "semi": ["error", "always"],
        "indent": ["error", 4],
        "keyword-spacing": ["error", {
            "before": true, 
            "after": false,
            "overrides": {
                "return": {
                    "after": true
                }
            }
        }]
    }
};