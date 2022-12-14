import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';

// Pages
import Dashboard from '@/pages/Dashboard/Dashboard';
import ExamDashboard from '@/pages/ExamDashboard/ExamDashboard';
import Typography from '@/pages/Typography/Typography'
import Tables from '@/pages/Tables/Basic'
import Notifications from '@/pages/Notifications/Notifications'
import Icons from '@/pages/Icons/Icons'
import Charts from '@/pages/Charts/Charts'
import Maps from '@/pages/Maps/Google'
import Error from "@/pages/Error/Error";
import Login from "@/pages/Login/Login";
import Devices from "@/pages/Devices/Devices";
import DeviceTypes from "@/pages/DeviceTypes/DeviceTypes";
import DomainInfo from "@/pages/DomainInfo/DomainInfo";
import Onem2mServer from "@/pages/Onem2mServer/Onem2mServer";
import DeviceDatas from "@/pages/DeviceData/DeviceDatas";
import SetNoti from "@/pages/SetNotis/SetNotis";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
    path: '/',
    redirect: 'login',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'devices',
        name: 'Devices',
        component: Devices
      },
      {
        path: 'devicetypes',
        name: 'DeviceTypes',
        component: DeviceTypes
      },
      {
        path: 'domaininfo',
        name: 'DomainInfo',
        component: DomainInfo
      },
      {
        path: 'onem2mserver',
        name: 'Onem2mServer',
        component: Onem2mServer
      },
      {
        path: 'deviceDatas',
        name: 'DeviceDatas',
        component: DeviceDatas
      },
      {
        path: 'setNotis',
        name: 'SetNotis',
        component: SetNoti
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'examdashboard',
        name: 'ExamDashboard',
        component: ExamDashboard,
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography,
      },
      {
        path: 'tables',
        name: 'Tables',
        component: Tables
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'charts',
        name: 'Charts',
        component: Charts
      },
      {
        path: 'maps',
        name: 'Maps',
        component: Maps
      },
    ],
  },
    {
      path: '*',
      name: 'Error',
      component: Error
    }
  ],
});
