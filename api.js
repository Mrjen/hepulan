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


module.exports = {
	apiUrl,
	teachList,
	teachDeatil,
	indexRand,
	moreVideo,
	videoNav
}