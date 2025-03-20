---
title: React에서 JWT를 이용하여 로그인 구현하기
description: React에서 JWT를 이용하여 로그인 구현하기
tags:
  - Dev
pubDate: 2022-08-05
---

웹 어플리케이션에서 로그인을 구현하는 방법은 크게 쿠키, 세션을 이용하는 방법과 토큰을 이용하는 방법 2가지가 있습니다. 간단히 말하면 쿠키, 세션 방식은 서버에서 세션아이디를 기록하고 브라우저에서 쿠키를 저장하는 방법이고 토큰 방식은 토큰을 발행하여 토큰의 유효성을 검증하는 방법입니다.

# 쿠키, 세션 vs 토큰

## 쿠키, 세션

사용자(클라이언트)가 서버에 자원을 요청 시 서버에서 사용자를 특정할 수 있는 데이터를 기반으로 세션 아이디를 생성하고, 해당 아이디를 키값으로 하여 필요한 값들을 서버의 메모리에 저장하고, HTTP 프로토콜의 header의 setCookie를 통해서 브라우저의 쿠키에 세션 아이디를 기록하도록 합니다.

브라우저는 request 요청을 보낼 시 header에 cookie를 자동으로 포함하여 보내게 되고(cors일 경우 credentials 등 세팅이 필요) 서버에서는 cookie의 세션 아이디를 토대로 사용자의 로그인 등을 판별할 수 있게 됩니다.

[인증 정보를 포함하기 위한 cors 설정](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS#%EC%9D%B8%EC%A6%9D%EC%A0%95%EB%B3%B4%EB%A5%BC_%ED%8F%AC%ED%95%A8%ED%95%9C_%EC%9A%94%EC%B2%AD)

### 장점

- 세션 방식은 세션 ID만 전송하므로 사용자 정보를 포함하는 JWT 토큰보다 전송되는 데이터 양이 적습니다.
- 사용자의 데이터를 서버에서 관리하기 때문에 사용자의 데이터가 토큰에 담겨있는 것보다 안전합니다.

### 단점

- 서버의 성능을 늘리는 방식을 scale-out으로 할 경우 각 서버의 세션을 동기화 해야하는 비용이 추가적으로 발생 할 수 있습니다.
- 사용자의 데이터를 서버의 메모리에 저장하기 때문에 메모리 용량에 대한 리스크가 있을 수 있습니다.

#### scale-out, scale-up

scale-out에 대해 간단히 설명하자면 서버의 성능을 물리적으로 올리는 방법 중 하나 입니다. 서버의 성능을 올리는 방법은 크게 scale-out과 scale-up으로 나눌 수 있습니다.

<img src="/images/scale.png" alt="scale-out / scale-up">

위 그림처럼 scale-out은 서버의 갯수를 늘려서 성능을 올리는 방법이고, scale-up은 서버 자체의 성능(디스크의 용량 등)을 올리는 방법입니다. 따라서 세션 방식의 경우 서버의 메모리에 의존적이기 때문에 서버의 갯수를 늘리는 scale-out방식으로 성능을 올릴 경우 세션에 대한 데이터를 어떻게 공유시킬 건지에 대한 고민도 필요합니다.

## 토큰

사용자가 로그인을 요청하면 서버는 사용자 정보를 기반으로 인증 토큰을 생성하여 클라이언트에 전달합니다. 이후 클라이언트는 API 요청 시 이 토큰을 함께 전송하고, 서버는 토큰의 유효성을 검증하여 사용자를 인증합니다.

토큰 방식의 장점은 유저 인증을 별도 서비스로 분리할 수 있다는 점입니다. 예를 들어, 구글 로그인 시 구글에서 발급한 토큰을 구글의 인증 서버로 검증하여 사용자를 인증할 수 있습니다.

### JWT(JSON Web Token)

JWT는 웹 표준 기반 토큰으로, 다음 세 부분으로 구성됩니다:

- **Header**: 토큰 유형과 사용된 암호화 알고리즘 정보
- **Payload**: 사용자 ID, 권한 등 클레임(claim) 정보
- **Signature**: 토큰이 변조되지 않았음을 증명하는 서명

JWT의 특징은 토큰 자체에 필요한 모든 정보가 포함되어 있어, 별도의 인증 서버 없이도 토큰을 해석하여 사용자를 인증할 수 있다는 점입니다.

#### Refresh Token과 Access Token

토큰 만료와 관련된 보안 이슈를 해결하기 위해 보통 두 가지 토큰을 함께 사용합니다:

- **Access Token**: 짧은 유효기간(몇 분~몇 시간)을 가지며, API 접근에 사용
- **Refresh Token**: 더 긴 유효기간을 가지며, Access Token이 만료되었을 때 새로운 Access Token을 발급받는 데 사용

#### JWT 사용 시 주의사항

- JWT를 localStorage에 저장할 경우 XSS 공격에 취약할 수 있으므로, httpOnly 쿠키 사용 고려
- 중요한 개인정보는 Payload에 포함하지 않는 것이 안전함
- Access Token의 유효기간은 가능한 짧게 설정하고 Refresh Token으로 보완

### 장점

- 사용자의 인증을 토큰을 통해서 관리하기 때문에 서버의 scale-out에서도 인증이 자유롭습니다.
- 사용자에 대한 인증 방식의 확장이 가능합니다. (facebook, google 등 소셜 로그인)

### 단점

- 인증된 토큰을 발급을 하면 토큰이 만료되기 전까지 토큰의 유효성을 막을 방법이 없습니다.
  - 사용자를 block을 시켜야 할 때 세션방식은 세션 아이디를 파기하여 즉시 block할 수 있지만, 토큰방식은 발급한 토큰이 expire 되기 전까지 사용자에 대한 인증이 유효할 수 있습니다.

# React에서 JWT를 이용하여 로그인 구현

작성되어 있는 코드는 의사코드로 동작을 보장하지 않습니다.

우선 로그인 시에 동작하는 flow를 정리하자면,

1. 새로고침 시에도 로그인 상태가 유지되어야 한다.

2. access token이 만료되면 refresh token을 통해서 재발행 받아야 한다.

3. refresh token이 만료되었다면 로그아웃 되어야 한다.

세부 사항을 구현하기 전에 access token은 api를 요청할 때 자주 사용하게 됨으로 여러 컴포넌트에서 공유되는 것이 좋을 것 같아 access token을 관리하는 context api를 통해서 공유되도록 합니다.

```tsx
// SessionProvider.js
import React from "react";

const SessionContext = React.createContext<SessionContextValue>();

export default const SessionProvider = ({
  children,
}) => {
  const [session, setSession] = React.useState();

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
```

그 후에 새로고침시에도 로그인을 유지시키기 위해서는 로컬스토리지에 access token과 refresh token을 저장합니다.

```tsx
// SessionProvider.js
import React from "react";

const SessionContext = React.createContext<SessionContextValue>();

export default const SessionProvider = ({
  children,
}) => {
  const [session, setSession] = React.useState(() => {
    const authToken = window.localStorage.getItem("authToken");
    const refreshToken = window.localStorage.getItem("refreshToken");

   if (authToken && refreshToken) {
      return {
        authToken,
        refreshToken,
      };
    }

    return undefined;
  });

  // 로그인 시에 로컬스토리지에 저장
  React.useEffect(() => {
    if (session) {
      localStorage.setItem("authToken", session.authToken);
      localStorage.setItem("refreshToken", session.refreshToken);
    }
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
```

로그인 시에 access token과 refresh token을 setSession을 통해 session state에 업데이트 하면, useEffect를 통해서 로컬스토리지에 저장됩니다. 새로 고침 시에는 로컬 스토리지에서 가져와 session state에 업데이트 합니다.

이제 새로고침 시에도 로그인이 풀리지 않고, 유지 할 수 있게 되었습니다. 다음은 access token이 만료되었을 경우 refresh token을 재발급하고 refresh token이 만료되었다면 로그아웃 시키도록 하겠습니다. access token을 재발급 받는 여러가지 방법이 있겠지만, 만료 5분전에 갱신되도록 하겠습니다.

```tsx
// SessionProvider.js
import React from "react";
import { decodeJwt } from "jose";

const SessionContext = React.createContext<SessionContextValue>();

export default const SessionProvider = ({
  children,
}) => {
   const [session, setSession] = React.useState(() => {
    const authToken = window.localStorage.getItem("authToken");
    const refreshToken = window.localStorage.getItem("refreshToken");

   if (authToken && refreshToken) {
      return {
        authToken,
        refreshToken,
      };
    }

    return undefined;
  });

  // 로그인 시에 로컬스토리지에 저장
  React.useEffect(() => {
    if (session) {
      localStorage.setItem("authToken", session.authToken);
      localStorage.setItem("refreshToken", session.refreshToken);
    }
  }, [session]);

  // 토큰 재발급을 담당
  React.useEffect(() => {
    if (!session) return;

    // 토큰 만료 5분 전에 갱신하도록 타이머 설정
    const authTokenExpiredTime = decodeJwt(session.authToken).exp;
    const timeUntilExpiry = (authTokenExpiredTime * 1000)- Date.now() - 300000; // 5분(300000ms) 전에 갱신
    if (timeUntilExpiry <= 0) {
      // 이미 만료 시간이 5분 이내라면 즉시 갱신
      refreshSession();
      return;
    }

    // 갱신 타이머 설정
    const refreshTimer = setTimeout(() => refreshSession(), timeUntilExpiry);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(refreshTimer);
  }, [session]);

  // 로그아웃 로직
  const removeSession = () => {
    setSession(undefined);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
```

로그아웃 시에는 로컬스토리지에 있는 토큰들을 삭제하고, session state도 초기화 하여 구현합니다.

## 보안해야 할 점

토큰을 로컬스토리지에 저장하는 것은 xss 공격에 탈취당할 위험성이 있습니다. 이를 방지하기 위해서는 백엔드에서 httpOnly로 토큰을 전송해주거나, 토큰을 암호화하여 저장하는 방법을 사용할 수 있습니다.
