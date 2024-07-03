import { Client } from '@notionhq/client';
import Conf from 'conf';

const config = new Conf({ projectName: 'auto-issue' });
const apiKey = config.get('notion_apiKey');
const databaseId = config.get('notion_databaseId');
const notion = new Client({ auth: apiKey });

/**
 * 데이터베이스 정보 조회
 */
async function getDatabaseInfo() {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });

  return response;
}

/**
 * 데이터베이스에 이슈 생성
 */
async function createIssue({ ticketTitle, ticketType }) {
  const response = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      이름: {
        title: [
          {
            text: {
              content: ticketTitle ?? '',
            },
          },
        ],
      },
      날짜: {
        date: {
          start: new Date().toISOString(),
        },
      },
      이슈_유형: {
        select: {
          name: ticketType,
        },
      },
    },
  });

  return response;
}

export { createIssue, getDatabaseInfo };
