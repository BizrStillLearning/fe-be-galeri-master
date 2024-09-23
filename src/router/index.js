// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import Dashboard from '../views/Dashboard.vue';
import GaleriTambah from '../views/GaleriTambah.vue';
import Galeri from '../views/Galeri.vue';
import AddUser from '../views/AddUser.vue';
import EditPengguna from '../views/EditPengguna.vue';
import UserTable from '../views/UserTable.vue';



const routes = [
  {
    path: '/',
    name: 'Home',
    component: LoginForm
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/galeritambah',
    name: 'GaleriTambah',
    component: GaleriTambah
  },
  {
    path: '/galeri',
    name: 'Galeri',
    component: Galeri
  },
  {
    path: '/adduser',
    name: 'AddUser',
    component: AddUser
  },
  {
    path: '/editpengguna',
    name: 'EditPengguna',
    component: EditPengguna
  },
  {
    path: '/usertable',
    name: 'UserTable',
    component: UserTable
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
