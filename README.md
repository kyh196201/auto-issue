# auto-issue

## Install & Development

```bash
npm i

# npm 배포
npm publish --access public

# auto-issue help
npm run dev -- help

# auto-issue setup
npm run dev -- setup

# auto-issue clear
npm run dev -- clear

# auto-issue start
npm run dev -- start

# auto-issue issues
npm run dev -- issues

# auto-issue issues with option
npm run dev -- issues --issue-type=bugfix
npm run dev -- issues -it bugfix
```

## Use

```bash
npm install -g @seungwoo-kim/auto-issue

which auto-issue

auto-issue help

auto-issue setup

auto-issue clear

auto-issue issues

auto-issue issues --issue-type=bugfix
auto-issue issues -it bugfix
```

## TODO

- [x] 이번 주에 작업한 티켓 목록 조회하기(parameter = ticketType)
- [ ] Command 파일 분리