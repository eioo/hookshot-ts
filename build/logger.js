"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signale_1 = require("signale");
exports.logger = new signale_1.Signale({
    config: {
        displayTimestamp: true,
    },
});
