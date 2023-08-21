package com.bitc.full505_final_team4.service;

import com.bitc.full505_final_team4.data.entity.NovelEntity;
import com.bitc.full505_final_team4.data.entity.NovelLikeEntity;
import com.bitc.full505_final_team4.data.entity.NovelPlatformEntity;

import java.util.List;

public interface NovelDetailService {
  List<NovelPlatformEntity> getNovelDetail(String title, String ebookCheck);

  void insertRidiToNovel(NovelEntity novelEntity);

  void insertRidiToPlatform(NovelPlatformEntity novelPlatformEntity);


  NovelPlatformEntity getNaverCrolling(String platformId, String title, String novelOrEbook);

  void insertNaverToNovel(NovelEntity novelEntity);

  void insertNaverToPlatform(NovelPlatformEntity novelPlatformEntity);

  NovelPlatformEntity getKakaoCrolling(String id, String title, String ne);

  void insertKakaoToNovel(NovelEntity novelEntity);

  void insertKakaoToPlatform(NovelPlatformEntity kakaoPlatformEntity);

  void updateNovelLike(int novelIdx, String id);

  NovelEntity getNovelIdx(String title, String ebookCheck);

  int getNovelLikeCount(NovelEntity novelIdx);

  List<NovelLikeEntity> getNovelLike(NovelEntity novelIdx);
}
