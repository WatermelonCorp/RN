#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('watermelon')
    .description('CLI for Watermelon Design System')
    .version('0.0.1');
program
    .command('init')
    .description('Initialize Watermelon in your project')
    .action(() => {
    console.log('Initializing Watermelon...');
});
program.parse();
