import React from "react";

import axios from "axios";
import {useNavigate} from "react-router-dom";

export const fetchData = async (platformId, title, ebookCheck) => {
  
  // console.log(ebookCheck);
  let novelDetail = {};
  
  try {
    const res = await axios.get("/novelDetail", {
      params: {
        title: title,
        ebookCheck: ebookCheck
      }
    })
    
    console.log(res);
    // DB에 저장되어있는지 유무 확인
    // db에 해당 작품이 있으면 정보 꺼내오기
    if (res.data.kakao || res.data.naver || res.data.ridi) {
      // DB에 저장되어 있다면 db에서 platform 데이터 들고와서 novelInfo 변경하기
      novelDetail = res.data;
    }
    // db에 해당 작품이 없으면 db 저장하기
    else {
      // 리디북스 디테일 페이지 정보 가져오기
      const ridiRes = await axios.get(`https://ridibooks.com/api/search-api/search?adult_exclude=n&keyword=${title}`);
      
      // 리디북스에 해당 작품 동일한 제목을 가진 작품이 있으면 db 저장, 없으면 카카오/네이버 검색 시도
      
      if (ridiRes.data.books) {
        for (let i = 0; i < ridiRes.data.books.length; i++) {
          if (title === ridiRes.data.books[i].title) {
            if (ebookCheck === '단행본') {
              if (ridiRes.data.books[i].web_title.includes('[e북]')) {
                const item = ridiRes.data.books[i];
                // console.log(item);
                
                const ridiRes2 = await axios.get(`https://book-api.ridibooks.com/books/${item.b_id}`);
                // console.log(ridiRes2);
                const item2 = ridiRes2.data;
                // console.log(item2);
                
                const ridiRes3 = await axios.get(`https://book-api.ridibooks.com/books/${item.b_id}/notices`);
                // console.log(ridiRes3);
                
                const item3 = ridiRes3.data.notices;
                // console.log(item3);
                
                const ridiRes4 = await axios.get('https://book-api.ridibooks.com/books/'+ item.b_id + '/descriptions')
                
                const item4 = ridiRes4.data.descriptions;
                
                const ridiObj = {
                  platform: 3,
                  platformId: item.b_id,
                  novelTitle: item.title,
                  novelThumbnail: "https://img.ridicdn.net/cover/"+ item.b_id +"/xxlarge",
                  novelIntro: item4.intro.replace(/<[^>]*>/g, ""),
                  novelAuthor: item.authors_info.map(auth => {
                    return auth.name;
                  }).toString(),
                  novelPubli: item.publisher,
                  novelCount: item.book_count,
                  novelPrice : item.price !== 0 ? item.price : item.series_prices_info[0].max_price,
                  novelStarRate: item.buyer_rating_score,
                  novelCompleteYn: item.is_series_complete ? "Y" : "N",
                  novelAdult: item.age_limit === 19 ? "Y" : "N",
                  novelRelease: item2.publish.ridibooks_register.substring(0, 10),
                  novelUpdateDate: item3.length === 0 ? null : item3[0].title,
                  cateList: item.parent_category_name.includes('BL') ? "7" : item.parent_category_name.includes("로맨스") ? "3" : item.parent_category_name.includes("로판") ? "4" : item.parent_category_name.includes("판타지") ? "1" : null,
                  ebookCheck: item.web_title.includes("e북") ? "단행본" : "웹소설"
                };
                
                console.log(ridiObj);
                
                
                // 리디북스 디테일 정보 디비에 저장
                const ridiRes5 = await axios.post('/novelDetail', null, {
                  params: {
                    id: platformId,
                    title: title,
                    ne: ebookCheck,
                    
                    platform: ridiObj.platform,
                    platformId: ridiObj.platformId,
                    novelTitle: ridiObj.novelTitle,
                    novelThumbnail: ridiObj.novelThumbnail,
                    novelIntro: ridiObj.novelIntro,
                    novelAuthor: ridiObj.novelAuthor,
                    novelPubli: ridiObj.novelPubli,
                    novelCount: ridiObj.novelCount,
                    novelPrice : ridiObj.novelPrice,
                    novelStarRate: ridiObj.novelStarRate,
                    novelCompleteYn: ridiObj.novelCompleteYn,
                    novelAdult: ridiObj.novelAdult,
                    novelRelease: ridiObj.novelRelease,
                    novelUpdateDate: ridiObj.novelUpdateDate,
                    cateList: ridiObj.cateList,
                    ebookCheck: ridiObj.ebookCheck
                  }
                })
                break;
              }
            }
            else if (ebookCheck === '웹소설') {
              if (ridiRes.data.books[i].web_title === '') {
                const item = ridiRes.data.books[i];
                // console.log(item);
                
                const ridiRes2 = await axios.get(`https://book-api.ridibooks.com/books/${item.b_id}`);
                // console.log(ridiRes2);
                const item2 = ridiRes2.data;
                // console.log(item2);
                
                const ridiRes3 = await axios.get(`https://book-api.ridibooks.com/books/${item.b_id}/notices`);
                // console.log(ridiRes3);
                
                const item3 = ridiRes3.data.notices;
                // console.log(item3);
                
                const ridiObj = {
                  platform: 3,
                  platformId: item.b_id,
                  novelTitle: item.title,
                  novelThumbnail: "https://img.ridicdn.net/cover/"+ item.b_id +"/xxlarge",
                  novelIntro: item.desc.replace(/<\/?[^>]+(>|$)/g, "").substring(13),
                  novelAuthor: item.authors_info.map(auth => {
                    return auth.name;
                  }).toString(),
                  novelPubli: item.publisher,
                  novelCount: item.book_count,
                  novelPrice : item.price !== 0 ? item.price : item.series_prices_info[0].max_price,
                  novelStarRate: item.buyer_rating_score,
                  novelCompleteYn: item.is_series_complete ? "Y" : "N",
                  novelAdult: item.age_limit === 19 ? "Y" : "N",
                  novelRelease: item2.publish.ridibooks_register.substring(0, 10),
                  novelUpdateDate: item3.length === 0 ? null : item3[0].title,
                  cateList: item.parent_category_name.includes('BL') ? "7" : item.parent_category_name.includes("로맨스") ? "3" : item.parent_category_name.includes("로판") ? "4" : item.parent_category_name.includes("판타지") ? "1" : null,
                  ebookCheck: item.web_title.includes("e북") ? "단행본" : "웹소설"
                };
                
                console.log(ridiObj);
                
                
                // 리디북스 디테일 정보 디비에 저장
                const ridiRes4 = await axios.post('/novelDetail', null, {
                  params: {
                    id: platformId,
                    title: title,
                    ne: ebookCheck,
                    
                    platform: ridiObj.platform,
                    platformId: ridiObj.platformId,
                    novelTitle: ridiObj.novelTitle,
                    novelThumbnail: ridiObj.novelThumbnail,
                    novelIntro: ridiObj.novelIntro,
                    novelAuthor: ridiObj.novelAuthor,
                    novelPubli: ridiObj.novelPubli,
                    novelCount: ridiObj.novelCount,
                    novelPrice : ridiObj.novelPrice,
                    novelStarRate: ridiObj.novelStarRate,
                    novelCompleteYn: ridiObj.novelCompleteYn,
                    novelAdult: ridiObj.novelAdult,
                    novelRelease: ridiObj.novelRelease,
                    novelUpdateDate: ridiObj.novelUpdateDate,
                    cateList: ridiObj.cateList,
                    ebookCheck: ridiObj.ebookCheck
                  }
                })
                break;
              }
            }
          }
          // 리디북스에는 해당 작품 검색결과가 없는 경우, 카카오/네이버만 검색 시도
          else {
            const novelRes = await axios.post('/novelDetail', null, {
              params: {
                id: platformId,
                title: title,
                ne: ebookCheck,
              }
            })
          }
        }
      }
      
      // db저장 후, db에서 데이터 불러오기
      const res = await axios.get("/novelDetail", {
        params: {
          title: title,
          ebookCheck: ebookCheck
        }
      })
      // console.log(res);
      // DB에 저장되어있는지 유무 확인
      // db에 해당 작품이 있으면 정보 꺼내오기
      if (res.data.kakao || res.data.naver || res.data.ridi) {
        // DB에 저장되어 있다면 db에서 platform 데이터 들고와서 novelInfo 변경하기
        // console.log(res.data);
        novelDetail = res.data;
      }
    }
  }
  catch (err) {
    console.log(err.message);
  }
  return novelDetail;
}
