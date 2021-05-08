import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'languages/index',
    loadChildren: () => import('./pages/languages/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'languages/add',
    loadChildren: () => import('./pages/languages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'lessons/index',
    loadChildren: () => import('./pages/lessons/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'lessons/add',
    loadChildren: () => import('./pages/lessons/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'exercise/index',
    loadChildren: () => import('./pages/exercise/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'exercise/add',
    loadChildren: () => import('./pages/exercise/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'tests/index',
    loadChildren: () => import('./pages/tests/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'tests/add',
    loadChildren: () => import('./pages/tests/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'pages/index',
    loadChildren: () => import('./pages/dictionary/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'pages/add',
    loadChildren: () => import('./pages/dictionary/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'pages/view',
    loadChildren: () => import('./pages/dictionary/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'tests/view',
    loadChildren: () => import('./pages/tests/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'lessons/view',
    loadChildren: () => import('./pages/lessons/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'languages/view',
    loadChildren: () => import('./pages/languages/view/view.module').then( m => m.ViewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
