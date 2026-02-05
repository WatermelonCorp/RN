#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

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
