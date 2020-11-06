import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/map',
    children: [
      {
        path: 'map',
        component: () => import('@/views/map/index'),
        name: 'Map',
        meta: { title: '地图', icon: 'map', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/report/index'),
        name: 'Report',
        meta: { title: '统计报表', icon: 'report' }
      }
    ]
  },
  {
    path: '/data-update',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/data-update/index'),
        name: 'DataUpdate',
        meta: { title: '引导屏数据更新', icon: 'data-update' }
      }
    ]
  },
  {
    path: '/monitoring-management',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitoring-management/index'),
        name: 'MonitoringManagement',
        meta: { title: '监控管理', icon: 'monitoring-management' }
      }
    ]
  },
  {
    path: '/intelligent-control',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/intelligent-control/index'),
        name: 'IntelligentControl',
        meta: { title: '智能控制', icon: 'intelligent-control' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    // redirect: '/permission/page',
    // alwaysShow: true, // will always show the root menu
    // name: 'Permission',
    // meta: {
    //   title: 'Permission',
    //   icon: 'lock',
    //   roles: ['admin', 'editor'] // you can set roles in root nav
    // },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/index'),
        name: 'RolePermission',
        meta: {
          title: '用户权限管理',
          icon: 'user',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/daily-cleaning',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/daily-cleaning/index'),
        name: 'DailyCleaning',
        meta: { title: '保洁管理', icon: 'cleaner' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
