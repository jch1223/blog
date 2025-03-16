---
title: OpenAPI Generator를 사용하여 api에 대한 typescript 코드젠
description: OpenAPI Generator에 대한 간단한 소개와 사용하면서 부딪친 버그 해결
tags:
  - Dev
pubDate: 2024-07-23
---

회사에서 OpenAPI-Specification으로 api 스펙을 yml 파일로 정의하여 백엔드와 프론트엔드간에 api 스펙을 공유하고 있습니다.

프론트엔드에서는 OpenAPI Generator에서 제공하는 typescript-axios를 사용하였고, OpenAPI-Specification에 맞게 작성된 yml파일을 타입스크립트로 코드젠을 하여 api에 대한 타입을 생성하였습니다.

OpenAPI Generator에 대한 간단한 소개와 사용하면서 부딪친 버그들을 소개하겠습니다.

## openapi generator란

[OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator?tab=readme-ov-file)는 위에서 설명한 것 처럼 OpenAPI-Specification으로 정의된 문서를 다양한 코드로 코드젠을 해주는 도구입니다.

## 설치

설치 방법은 [공식문서](https://github.com/OpenAPITools/openapi-generator)를 참고 하시는 것이 제일 좋습니다. 예시는 brew를 사용하여 설치하는 방법입니다.

```bash
brew install openapi-generator
brew tap AdoptOpenJDK/openjdk
brew install --cask adoptopenjdk11
export JAVA_HOME=`/usr/libexec/java_home -v 1.11`
```

[npm을 사용하여 설치](https://openapi-generator.tech/docs/installation/#npm)도 가능합니다

## 사용 방법

간단한 예시: https://github.com/jch1223/openapi-generator/tree/main

[OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification?tab=readme-ov-file)에서 문법을 살펴볼 수 있습니다. 아래처럼 yml파일에 스펙을 정의 한 후

```yaml
openapi: 3.0.3
info:
  title: test api
  version: 0.0.1
servers:
  - url: https://localhost:3000
    description: 로컬호스트
paths:
  /data:
    get:
      summary: 데이터 조희
      description: |-
        데이터 조희
      parameters:
        - name: exampleQueryStirng
          in: query
          schema:
            type: object
            properties:
              nullableSting:
                type: string
                nullable: true
              nullalbeArray:
                type: array
                items:
                  type: string
                  nullable: true
      responses:
        '200':
          description: 성공 응답으로 데이터를 반환합니다.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
                  nullable: true
                  description: 데이터
```

아래 명령어를 통해 코드젠을 할 수 있습니다.

```bash
openapi-generator-cli generate -g typescript-axios -i ./src/schema/openapi.yml -o ./src/api
```

사용한 명령어는 아래와 같은 의미를 지닙니다

-g: 사용할 제너레이터

-i : 스펙 파일 폴더 위치

-o: output 폴더

쉘에서 실행을 시키면 [타입스크립트 코드](https://github.com/jch1223/openapi-generator/tree/main/src/api)를 생성해 주어서 이를 기반으로 api 요청 함수에 대한 타입 정의를 자동화 시킬 수 있습니다.

## 버그 수정기

### 생성된 setFlattenedQueryParams 함수에서 null에 대한 처리가 안되는 버그

코드젠을 하면 [setFlattenedQueryParams](https://github.com/jch1223/openapi-generator/blob/main/src/api/common.ts#L87-L107) 함수가 생성이 되고 이 함수를 통해서 param을 query string으로 변환합니다.

생성된 api 함수를 통해서 null이 포함된 param을 넘겨주었을 때 에러가 터지는 문제가 생겼습니다. 그래서 살펴보니 회사에서는 [6.2.1(22년 11월 1일 배포)](https://mvnrepository.com/artifact/org.openapitools/openapi-generator/6.2.1) 버전을 사용하고 있었는데, null에 대한 처리가 [22년 12월에 수정](https://github.com/OpenAPITools/openapi-generator/pull/14018)이 되어서 버전을 올리는 것으로 해결하였습니다.

### 코드젠에서 Array<string | null> 로 안뽑히는 버그

OpenAPI-Specification에서 null에 대한 처리가 되는 것은 3.0.x이상부터 정직적으로 지원되기 시작하였습니다.([관련 내용](https://stackoverflow.com/questions/48111459/how-to-define-a-property-that-can-be-string-or-null-in-openapi-swagger))

회사에서는 3.0.x 버전을 사용하고 있었고, 아래와 같이 yml 파일에 스펙을 정의 하였을 때,

```yaml
paths:
  /data:
    get:
      summary: 데이터 조희
      description: |-
        데이터 조희
      parameters:
        - name: exampleQueryStirng
          in: query
          schema:
            type: object
            properties:
              nullableSting:
                type: string
                nullable: true
              nullalbeArray:
                type: array
                items:
                  type: string
                  nullable: true
```

```typescript
export interface DataGetExampleQueryStirngParameter {
  /**
   *
   * @type {string}
   * @memberof DataGetExampleQueryStirngParameter
   */
  nullableSting?: string | null;
  /**
   *
   * @type {Array<string>}
   * @memberof DataGetExampleQueryStirngParameter
   */
  nullalbeArray?: Array<string | null>;
}
```

nullalbeArray의 타입이 `Array<string | null>` 로 나타나기를 기대하였지만, [결과](https://github.com/jch1223/openapi-generator/blob/8f9c3ce94a089093a2f6e7c226063f51623ea921/src/api/api.ts#L31-L44)는

```typescript
export interface DataGetExampleQueryStirngParameter {
  /**
   *
   * @type {string}
   * @memberof DataGetExampleQueryStirngParameter
   */
  nullableSting?: string | null;
  /**
   *
   * @type {Array<string>}
   * @memberof DataGetExampleQueryStirngParameter
   */
  nullalbeArray?: Array<string>;
}
```

`Array<string | null>` 이 아닌 `Array<stiring>`으로 코드젠이 되었습니다. string의 경우에는 nullable하게 타입이 잘 나타났지만 array에서는 나타나지 않아서 조사를 해보니 array에 대한 nullable이 버그가 있다는 것을 알게 되었습니다.

issue: https://github.com/OpenAPITools/openapi-generator/issues/13445

정해진 개발 일정이 임박하여 백엔드 엔지니어와 array에 대한 nullable 처리를 타입 캐스팅이나 null 대신 ""(빈문자열)을 보내는 것으로 논의했었는데, 이런 버그가 있다는 것을 프론트엔드 팀에 공유하니 구성원께서 [버그 픽스 기여](https://github.com/OpenAPITools/openapi-generator/pull/19157)를 해주셔서 nullable 타입을 사용할 수 있게 되었습니다.

해당 이슈는 24년 7월경 발생하였고, 버그 픽스에 대한 정식 배포는 24년 8월 예정이었습니다. 그리하여 버그 픽스된 버전을 클론 받아서 실행하였습니다. 클론을 받은 후에 해당 레포 위치에서 아래 shell 스크립트를 실행합니다

```bash
./mvnw clean install
```

설치까지 꽤나 오랜 시간이 소요됩니다. 그 후 해당 레포 위치에서 아래 shell 스크립트를 실행하면 array도 nullable하게 코드젠이 잘 작동 합니다.

```bash
java -jar modules/openapi-generator-cli/target/openapi-generator-cli.jar generate \
 -i samples/client/openapi.yml \
 -g typescript-axios\
 -o samples/client/typescript
```

이렇게 해서 버그 픽스된 버전을 사용하면 문제가 해결됩니다.
