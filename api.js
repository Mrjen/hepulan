// const apiUrl:"https://api2.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index"
const apiUrl = 'https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index';

const doman = 'https://hepulan.playonwechat.com/site/'

// 获取老师列表
const teachList = doman + 'skin-teachers'
// 获取老师的详细信息
const teachDeatil = doman + 'skin-teacher-resume'
// 首页数据
const indexRand = doman + 'index-rand'
// 获取视频
const moreVideo = doman + 'video-list'
// 获取视频页面导航
const videoNav = doman + 'video-types'
// 统计播放次数
const videoNum = doman + 'add-play-number'
// 搜索老师
const searchTeach = doman + 'skin-teacher-search'
// 禾圈点赞或预览图片加积分
const zanAndPrewAddScore = doman + 'add-score-rand'
// 点击客服按钮
const tunJiContact = doman + 'add-click-records';


module.exports = {
	apiUrl,
	teachList,
	teachDeatil,
	indexRand,
	moreVideo,
	videoNav,
	videoNum,
	searchTeach,
	zanAndPrewAddScore,
  tunJiContact
}