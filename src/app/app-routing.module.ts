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
    path: 'index',
    loadChildren: () => import('./pages/languages/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/languages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/lessons/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/lessons/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/exercise/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/exercise/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/tests/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/tests/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'dictionary',
    loadChildren: () => import('./pages/dictionary/dictionary.module').then( m => m.DictionaryPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/dictionary/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/dictionary/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./pages/dictionary/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./pages/tests/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./pages/lessons/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'view',
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
