# 주저리 → PRD → 보고자료 자동화

생각나는 대로 쓴 텍스트(주저리)를 넣으면 **PRD(보고자료 기획서)** 로 정리한 뒤,
같은 PRD로 **웹 보고자료(Vercel 배포)** 와 **Figma 슬라이드 초안**을 만든다.

AX 교육 과제 제출용 저장소다.

```
주저리 텍스트 ──▶ 00_원문.md ──▶ 01_PRD.md ──┬─▶ index.html  ──▶ GitHub push ──▶ Vercel 자동 배포
  (그대로 보존)      (정리·구조화)     (슬라이드 명세) └─▶ Figma 1920×1080 슬라이드 초안
```

## 왜 PRD를 거치는가

주저리에서 바로 슬라이드를 만들면 결과물마다 구성이 달라지고, 어디까지가 원문이고 어디부터가 AI의 추정인지 구분이 안 된다.
PRD를 중간에 두면:

- **원문 → PRD** 단계에서 빠진 것, 추정한 것, 확인이 필요한 것을 따로 적어 둔다.
- **PRD → 결과물** 단계는 정해진 슬라이드 유형 7가지로만 렌더링하므로, HTML과 Figma가 같은 구성을 갖는다.
- 사람이 고칠 곳은 PRD 하나다. PRD를 고치면 HTML·Figma를 다시 만들면 된다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `reports/<날짜>-<슬러그>/00_원문.md` | 입력 원문. **손대지 않고 그대로** 보존 |
| `reports/<날짜>-<슬러그>/01_PRD.md` | 원문을 정리한 보고자료 기획서 + 슬라이드 명세 |
| `reports/<날짜>-<슬러그>/index.html` | 배포되는 보고자료 페이지 |
| `templates/PRD_템플릿.md` | PRD 양식 (슬라이드 유형 7종 정의 포함) |
| `templates/report.html` | 보고자료 HTML 양식 (유형별 예시 포함) |
| `scripts/build-index.mjs` | `reports/` 를 읽어 첫 화면 목록(`index.html`) 생성 |
| `.claude/skills/notes-to-report/` | 전체 과정을 한 번에 실행하는 Claude Code 스킬 |

## 사용법

### 1) Claude Code로 한 번에 (권장)

이 폴더를 VS Code(또는 터미널)에서 Claude Code로 연 뒤:

```
/notes-to-report
<주저리 텍스트 붙여넣기>
```

스킬이 원문 저장 → 공개 적합성 점검 → PRD → HTML → Figma 초안 → 목록 갱신 → 커밋까지 진행하고,
push 직전에 한 번 확인을 받는다.

### 2) 수동으로

1. `reports/<날짜>-<슬러그>/` 폴더를 만들고 원문을 `00_원문.md` 에 붙여넣는다.
2. `templates/PRD_템플릿.md` 를 복사해 `01_PRD.md` 를 채운다.
3. `templates/report.html` 를 복사해 `index.html` 을 PRD 슬라이드 명세대로 채운다.
4. `node scripts/build-index.mjs` 로 첫 화면 목록을 갱신한다.
5. 커밋 후 push → Vercel이 자동 배포한다.

## 배포

- 저장소: GitHub 공개(public) 저장소
- 호스팅: Vercel (GitHub 저장소 연결, 빌드 없음, 정적 파일 그대로 배포)
- `main` 브랜치에 push하면 자동으로 다시 배포된다.

## 공개 저장소 주의

이 저장소는 누구나 볼 수 있다. 원문에 아래가 섞이면 넣기 전에 지우거나 가명으로 바꾼다.

- 실명·연락처·주소 등 개인정보, 고객사 이름
- 계정·비밀번호·API 키·토큰
- 공개되지 않은 매출·단가·계약 조건
