const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar || JSON.parse(sessionStorage.getItem('avatar')),
  name: state => state.user.name || JSON.parse(sessionStorage.getItem('name')),
  // introduction: state => state.user.introduction || JSON.parse(sessionStorage.getItem('introduction')),
  roles: state => state.user.roles || JSON.parse(sessionStorage.getItem('roles')),
  userMassage: state => state.user.userMassage || JSON.parse(sessionStorage.getItem('userMassage')),
  projectList: state => state.user.projectList || JSON.parse(sessionStorage.getItem('projectList')),
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters