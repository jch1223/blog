import type { DocSearchProps } from '@docsearch/react';
import { useMemo } from 'react';
import { languages, type LangType } from '@/typings/config';

export const algoliaLocalesConfig: Record<
  LangType,
  Omit<DocSearchProps, 'appId' | 'apiKey' | 'indexName'>
> = {
  'en-US': {},
  'ko-KR': {
    placeholder: '검색',
    translations: {
      button: {
        buttonText: '검색',
        buttonAriaLabel: '검색',
      },
      modal: {
        searchBox: {
          resetButtonTitle: '초기화',
          resetButtonAriaLabel: '초기화',
          cancelButtonText: '취소',
          cancelButtonAriaLabel: '취소',
        },
        startScreen: {
          recentSearchesTitle: '검색 기록',
          noRecentSearchesText: '검색 기록이 없습니다.',
          saveRecentSearchButtonTitle: '검색 기록에 저장',
          removeRecentSearchButtonTitle: '검색 기록에서 제거',
          favoriteSearchesTitle: '즐겨찾기',
          removeFavoriteSearchButtonTitle: '즐겨찾기에서 제거',
        },
        errorScreen: {
          titleText: '결과를 가져오지 못했습니다.',
          helpText: '네트워크 연결을 확인해주세요.',
        },
        footer: {
          selectText: '선택',
          navigateText: '전환',
          closeText: '닫기',
          searchByText: '검색 제공자',
        },
        noResultsScreen: {
          noResultsText: '검색 결과를 찾을 수 없습니다.',
          suggestedQueryText: '다른 검색어를 시도해보세요.',
          reportMissingResultsText: '검색 결과가 없다고 생각하시나요?',
          reportMissingResultsLinkText: '피드백 보내기',
        },
      },
    },
  },
};

export function useLocales(local: LangType = languages[0]) {
  const config = useMemo(() => {
    return algoliaLocalesConfig[local];
  }, [local]);

  return config;
}
