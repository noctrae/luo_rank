const axios = require('axios');

export default async function handler(req, res) {
  const API_URL = "https://webcast.amemv.com/magic/api/v4/MjQxNzU2NjE0NDIy/ranklist/MjQxNzU2NjE0NDMy/list?page_num=1&page_size=50&contributor_count=3&guest_count=1&aid=1128";
  try{
    const resp = await axios({
      method:"GET",
      url:API_URL,
      headers:{
        "Referer":"https://webcast.amemv.com/",
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout:8000
    });
    const outer = resp.data;
    const body = JSON.parse(outer.data);
    const list = body.rank_list;

    let targetItem = null;
    for(const item of list){
      const nick = item.element_info.nick_name.trim();
      if(nick === "羅"){
        targetItem = item;
        break;
      }
    }
    if(!targetItem){
      return res.status(200).json({code:-1,msg:"未找到主播【羅】"});
    }
    const targetScore = Number(targetItem.rank_info.score);
    const targetRank = targetItem.rank_info.rank;
    let prevScore=null,nextScore=null;
    for(const it of list){
      const r = it.rank_info.rank;
      if(r === targetRank -1) prevScore = Number(it.rank_info.score);
      if(r === targetRank +1) nextScore = Number(it.rank_info.score);
    }
    res.status(200).json({
      code:0,
      data:{
        rank:targetRank,
        score:targetScore,
        prevScore,
        nextScore
      }
    });
  }catch(err){
    res.status(200).json({code:-1,msg:String(err.message)});
  }
}
