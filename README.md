# Guardy Landing (Static + Google Sheets Waitlist)

## 준비
1) Google Sheets 새로 만들고 탭 이름을 `Waitlist` 로 변경  
   (선택) 헤더: `Timestamp | Name | Email | Note | UTM`

2) 시트에서 **확장 프로그램 → Apps Script** 열고 `apps_script.gs` 내용 붙여넣기  
   - `REPLACE_WITH_YOUR_SHEET_ID` 를 시트 ID로 교체 (URL의 /d/ 와 /edit 사이 문자열)

3) Apps Script 배포
   - 배포 → 새 배포 → 유형: **웹 앱**
   - 실행 사용자: **나**
   - 접근 권한: **링크가 있는 모든 사용자**
   - 발급된 **웹 앱 URL** 복사

4) `index.html`의 `ACTION_URL_HERE` 를 위 웹 앱 URL로 교체

5) `index.html` 을 로컬에서 열어 제출 테스트 → 시트에 행이 추가되는지 확인

## 팁
- 스팸 방지: 허니팟(이미 포함), reCAPTCHA v3 추가 가능
- 알림: Apps Script에서 GmailApp.sendEmail로 관리자 알림 전송 가능
- 배포: Netlify / GitHub Pages / Vercel 등 정적 호스팅
