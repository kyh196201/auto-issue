#!/usr/bin/env node

import { Command } from 'commander';
import shell from 'shelljs';
import { createIssue, getDatabaseInfo } from './notion.js';
import Conf from 'conf';
import inquirer from 'inquirer';
import chalk from 'chalk';

const config = new Conf({ projectName: 'auto-issue' });
const program = new Command();

program.name('auto-issue').description('CLI with Notion API by seungwoo-kim').version('1.0.1');

// Db command
program
  .command('db')
  .description('노션 데이터베이스 정보 조회')
  .action(() => {
    getDatabaseInfo().then((response) => {
      console.log('🔎 노션 데이터 베이스 정보', response);
    });
  });

// Clear command
program
  .command('clear')
  .description('CLI 설정 초기화')
  .action(() => {
    config.clear();
  });

// Setup command
program
  .command('setup')
  .description('CLI 설정')
  .action(async () => {
    if (config.get('notion_apiKey') && config.get('notion_databaseId')) {
      console.log(chalk.red('Already setup!'));
      return;
    }

    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'notionApiKey',
          message: '노션 api key 입력',
        },
      ])
      .then((answers) => {
        config.set('notion_apiKey', answers.notionApiKey);
      });

    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'notionDatabaseId',
          message: '노션 database id 입력',
        },
      ])
      .then((answers) => {
        config.set('notion_databaseId', answers.notionDatabaseId);
      });

    console.log(chalk.green('⚙️ 설정 완료'));
  });

program
  .command('create-branch')
  .description('브랜치를 생성')
  .argument('<name>', '브랜치 이름')
  .option('-it, --issue-type <type>', '이슈 타입', 'bugfix')
  .option('-t, --target <target>', '브랜치를 생성할 타겟이 되는 원격 브랜치', 'origin/develop')
  .action((name, options) => {
    const { issueType, target } = options;
    const branchName = `${issueType}/${name}`;

    shell.exec('git fetch origin');

    shell.exec(`git switch -c "${branchName}" "${target}"`);

    shell.exit();
  });

// Start command
program
  .command('start')
  .description('티켓 시작(브랜치를 생성하고, 노션 데이터베이스에 페이지를 생성합니다.)')
  .action(async () => {
    if (!config.get('notion_apiKey') || !config.get('notion_databaseId')) {
      console.log(chalk.red('설정을 먼저 완료하세요.(auto-issue help)'));
      return;
    }

    // 티켓 유형
    const ticketType = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'ticketType',
          message: '티켓 타입 입력 (bugfix, feature, hotfix)',
          default: 'bugfix',
          validate: (value) => {
            const types = ['bugfix', 'feature', 'hotfix'];
            return types.includes(value) || 'Invalid issue type';
          },
        },
      ])
      .then((answers) => {
        return answers.ticketType;
      });

    // 티켓 제목
    const ticketTitle = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'ticketTitle',
          message: '티켓 제목(타이틀) 입력',
          validate: (value) => (value.trim() ? true : 'Title cannot be empty'),
        },
      ])
      .then((answers) => {
        return answers.ticketTitle;
      });

    // 원격 브랜치
    const targetBranch = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'targetBranch',
          message: '티켓의 브랜치를 생성할 원격 브랜치 입력',
          default: 'origin/develop',
        },
      ])
      .then((answers) => {
        return answers.targetBranch;
      });

    const branchName = `${ticketType}/${ticketTitle}`;

    shell.exec('git fetch origin');

    const shellResponse = shell.exec(`git switch -c "${branchName}" "${targetBranch}"`);

    if (shellResponse.code === 0) {
      await createIssue({ ticketTitle, ticketType });

      console.log(chalk.green('💡 이슈 생성 성공, 작업을 시작하세요.'));
    } else {
      console.log(chalk.red('⚠️ 브랜치 생성 실패'));
    }

    shell.exit();
  });

program.parse();
