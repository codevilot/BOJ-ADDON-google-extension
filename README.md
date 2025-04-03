# BOJ Server

`boj-server`는 [BOJ Addon](https://chromewebstore.google.com/search/BOJ%20Addon?hl=ko)과 함께 사용하여 백준에서 C++과 Python을 에디터 없이 실행할 수 있도록 도와주는 서버입니다.

## 설치 및 실행

```sh
npx boj-server
```

이 명령어를 실행하면 `boj-server`가 실행되며, BOJ Addon과 연동하여 코드 실행 환경을 제공합니다.

## 주요 기능

- BOJ Addon과 함께 사용 가능
- 로컬에서 C++ 및 Python 코드 실행 지원
- 간편한 실행 환경 제공

## 사용 방법

1. [BOJ Addon](https://chromewebstore.google.com/search/BOJ%20Addon?hl=ko)을 설치합니다.
2. 터미널에서 `npx boj-server`를 실행합니다.
3. 백준 문제 페이지에서 BOJ Addon을 통해 C++ 및 Python 코드를 실행합니다.

## 캐시 삭제

서버 캐시를 삭제하려면 다음 명령어를 실행하세요.

```sh
npx boj-server clean-cache
```

## 참고

- 기본적으로 **포트 100번**을 사용하므로, 해당 포트가 사용 가능한지 확인하세요.

## 라이선스

MIT License

