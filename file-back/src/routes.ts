import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BasicLayout from '@/layouts/BasicLayout';

import Setting from '@/pages/Person'

import AllFiles from '@/pages/AllFiles'
import Upload from '@/pages/Upload'


const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/register',
        component: Register,
      },
    ],
  },
  {
    path: '/base',
    component: BasicLayout,
    children: [
      {
        path: '/allFiles',
        component: AllFiles,
      },
      {
        path: '/person',
        component: Setting,
      },
      {
        path: '/',
        redirect: '/base/allFiles'
      }
    ],
  },
  {
    path: '/',
    redirect: '/user/login'
  }
];
export default routerConfig;
