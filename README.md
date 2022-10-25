# BOJ-ADDON
백준 문제풀이 애드온</br></br>
백준 문제풀이 에드온은 백준 온라인 저지 사이트에서 **바로 문제를 풀 수 있게 도와주는 크롬 익스텐션**입니다.</br></br>
현재는 **Node.js**로만 문제풀이가 가능하며, 추후 다른 언어 문제풀이 추가도 추가할 예정입니다.</br></br>
추가적인 요청 사항을 **이슈**에 남겨주시면 추가로 수정하겠습니다. </br></br>

## FE를 위한 크롬 익스텐션 개발기
https://careerly.co.kr/comments/70068

## 설치 방법
1. [백준 애드온 크롬 웹 스토어](https://chrome.google.com/webstore/detail/boj-addon/okppngggdhclomfpdomgdpdndfgdljhb?hl=ko) 로 이동해서 크롬 익스텐션을 설치한다.</br>
2. [백준 온라인 저지 예제](https://www.acmicpc.net/problem/2557)에서 설치가 되었는지 확인한다.</br></br>

## 사용 방법
1. [백준 온라인 저지 예제](https://www.acmicpc.net/)에서 마음에 풀고 싶은 문제 페이지로 이동한다.</br></br>
![image](https://user-images.githubusercontent.com/18400730/197824980-bda55ee2-f62c-4d07-a4bb-a895b4385096.png)
</br>
2. 백준 사이트에서 예제 입력에 입력된 값의 형태를 보고 입력 예시창에서 **비슷한 케이스 버튼**을 클릭한다.</br></br>
(다양한 예시를 이용하여 문제를 풀 수 있지만 지금은 "첫째 줄에 N, 두 번째줄부터 값 정렬" 버튼을 사용하였다.)</br></br> 

<img src="https://user-images.githubusercontent.com/18400730/197826418-f8a4e4ab-039d-43bd-8844-ea67614bff89.png"  width="300" height="600"/>


```
const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split("\n");
```

입력 예시창을 누르면 다음과 같은 코드가 입력 예시창에 입력된다. </br></br>
만일 케이스를 추가하고 싶다면 문제의 하단의 예제를 추가한다.</br></br>
**주의 : 값을 넣은 후에는 예제 적용하기를 클릭한다.**</br></br>

<img src="https://user-images.githubusercontent.com/18400730/197828734-23dde3dd-4f7b-4df3-ad0a-7da077c05f61.png"  width="500" height="300"/>

4. 문제를 풀이한 후, **실행버튼**을 누른다.</br>

<img src="https://user-images.githubusercontent.com/18400730/197830514-1c37cb1e-c004-44c8-8077-e41436fc5984.png" />

</br>
5. 문제를 실행하면 맞으면 **초록색 글씨**, 문제를 틀리면 **빨간 글씨**가 나온다.</br>

### 기능 명세
- iframe을 이용하여 백준 문제풀이 페이지에 문제풀이 모나코 에디터를 동적으로 그려줍니다.</br>
- 모나코 에디터에서 콘솔로 출력될 값을 실행결과 element에 텍스트를 삽입합니다.</br>
- 백준 문제풀이에 있는 예제 입력을 require("fs").readFileSync("/dev/stdin")을 이용하여 입력한다.</br>
- 백준 페이지에 있는 예제 입력값을 이용하여 출력한 값과 백준 페이지의 예제 출력의 값을 비교한다.</br>
- 둘의 값이 같다면 글자가 초록색, 값이 다르다면 글자가 빨간색으로 출력된다.</br></br>

### 주의 사항

#### 사용 가능 언어
이 크롬 익스텐션은 현재 **Node.js**로만 문제 풀이가 가능합니다.

#### 추가 테스트케이스 추가 시
추가 테스트케이스 값을 입력하고 예제 적용하기 버튼을 눌러야합니다.

### Release Node
- 1.0.1
sample 창이 상단 바를 눌렀을 때 사라지지 않는 현상 수정
- 1.0.2
input을 받는 케이스를 /dev/stdin 이외의 환경 추가

