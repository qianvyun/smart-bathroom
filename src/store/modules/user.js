import { login, logout, getInfo, toiletList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userMassage: '',
  projectList: null,
  currentPageItem: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction;
  //   sessionStorage.setItem('introduction', JSON.stringify(introduction));
  // },
  SET_NAME: (state, name) => {
    state.name = name
    sessionStorage.setItem('name', JSON.stringify(name))
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    sessionStorage.setItem('avatar', JSON.stringify(avatar))
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
    sessionStorage.setItem('roles', JSON.stringify(roles))
  },
  SET_USER_MASSAGE: (state, userMassage) => {
    state.userMassage = userMassage
    sessionStorage.setItem('userMassage', JSON.stringify(userMassage))
  },
  SET_PROJECT_LIST: (state, projectList) => {
    state.projectList = projectList
    sessionStorage.setItem('projectList', JSON.stringify(projectList))
  },
  SET_CURRENT_PAGE_ITEM: (state, project) => {
    state.currentPageItem = project
    sessionStorage.setItem('currentProject', JSON.stringify(project))
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, captcha: captcha }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USER_MASSAGE', data.user)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { userType, name, avatar, list } = data // introduction
        // roles must be a non-empty array
        if (userType < 0 || userType > 3) {
          reject('getInfo: roles must be a non-null')
        }
        let roles = ['admin']
        switch (userType) {
          case 0:
            roles = ['admin']
            break
          case 1:
            roles = ['editor']
            break
          case 2:
            roles = ['cleaner']
            break
          case 3:
            roles = ['repairman']
            break
          default:
            roles = ['admin']
            break
        }
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        data.roles = roles
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_PROJECT_LIST', list)
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getProjectList({ commit, state }) {
    return new Promise((resolve, reject) => {
      // projectList().then(response => {
      toiletList().then(response => {
        const { data } = response

        if (!data) {
          reject('没有厕所信息.')
        }

        commit('SET_PROJECT_LIST', data)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      const token = { token: state.token }
      logout(token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        sessionStorage.removeItem('introduction')
        sessionStorage.removeItem('name')
        sessionStorage.removeItem('avatar')
        sessionStorage.removeItem('roles')
        sessionStorage.removeItem('projectList')
        sessionStorage.removeItem('userMassage')
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  getCurrentPageItem({ commit }, data) {
    commit('SET_CURRENT_PAGE_ITEM', data)
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
