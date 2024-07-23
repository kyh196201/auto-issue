import { Client } from '@notionhq/client';
import Conf from 'conf';
import { NOTION_DB_PROPERTY } from './constants.js';

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
      [NOTION_DB_PROPERTY.NAME]: {
        title: [
          {
            text: {
              content: ticketTitle ?? '',
            },
          },
        ],
      },
      [NOTION_DB_PROPERTY.DATE]: {
        date: {
          start: new Date().toISOString(),
        },
      },
      [NOTION_DB_PROPERTY.ISSUE_TYPE]: {
        select: {
          name: ticketType,
        },
      },
    },
  });

  return response;
}

async function getIssueOfThisWeek({ issueType }) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: NOTION_DB_PROPERTY.DATE,
          date: {
            this_week: {},
          },
        },
        {
          property: NOTION_DB_PROPERTY.ISSUE_TYPE,
          select: issueType
            ? {
                equals: issueType,
              }
            : {
                // 이슈_유형 속성에 값이 있는 모든 데이터를 조회
                is_not_empty: true,
              },
        },
      ],
    },
  });

  const issues = response.results.map((it) => {
    const title = it.properties['이름'].title[0];

    return {
      text: title.text.content,
      link: title.text.link,
    };
  });

  return {
    issues,
    count: issues.length,
  };
}

export { createIssue, getDatabaseInfo, getIssueOfThisWeek };
