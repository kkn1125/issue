# Issue

이슈는 에러 처리를 위해 만든 예외처리 라이브러리 입니다.

## 업데이트 이력

- 0.1.0
  - 이슈 패키징 테스트
    - 이슈 파이프라인에 서브 이슈 해결하는 로직 테스트
    - 이슈 해결 시 기본적으로 이슈 카피 후 처리하도록 수정
    - 이슈 해결 후 반환 타입 Solved로 지정
    - 이슈 solve 및 pipe 인자 명시적으로 받을 수 있도록 타입 수정
- 0.0.4
  - 이슈 처리 기록하는 task trace 객체 구현
  - 이슈 feature, format 테스트 케이스 작성
  - 로거 객체 제작
  - 이슈 클래스에 로거 결합
  - enum 타입 분리
  - util 메서드 util 클래스로 분리
  - 분리된 클래스 코어의 멤버변수에 인스턴스로 주입
- 0.0.3
  - 이슈 기본 기능 설계 및 디자인
  - 이슈 try, catch, finally 제작
  - 이슈 async solve 제작
  - 이슈 throw optional 처리
- 0.0.2
  - feat
    - 테스트 환경 설정
      - vitest
    - ts-node 설정
    - 이슈 인자 등록
    - 이슈 파이프라인 빌드
    - 이슈 파이프라인 빌드 일괄 처리
      - 반환 인자 사용
- 0.0.1
  - init
    - 초기화 커밋
    - 
<!-- %comspec% /k "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.10.6\sbin\rabbitmq-service.bat" start & if not errorlevel 1 exit /b 0


C:\Windows\System32\cmd.exe /k cd /d C:\Program Files\RabbitMQ Server\rabbitmq_server-3.10.6\sbin && rabbitmq-service.bat start & if not errorlevel 1 exit /b 0 -->