#!/usr/bin/env node

import { program } from "commander";
import shell from 'shelljs';

program
  .name('auto-issue')
  .description('CLI by seungwoo-kim')
  .version('0.0.1');

program.command('create-branch')
  .description('브랜치를 생성합니다.')
  .argument('<name>', '브랜치 이름')
  .option('-t, --type <type>', '이슈 타입', 'bugfix')
  .action((branchName, options) => {
		console.log({
			branchName, 
			options,
		});

		const res = shell.exec(`git checkout -b "${branchName}"`);
		console.log('res', res);

		// if (!shell.which('git')) {
		// 	shell.echo('Sorry, this script requires git');
		// 	shell.exit(1);
		// }
  });

program.parse();