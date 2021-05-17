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
    path: 'languages/add/:id',
    loadChildren: () => import('./pages/languages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'lessons/view/:id',
    loadChildren: () => import('./pages/lessons/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'lessons/index/:id',
    loadChildren: () => import('./pages/lessons/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'lessons/add/:id',
    loadChildren: () => import('./pages/lessons/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'exerciseL/add/:id',
    loadChildren: () => import('./pages/exercise/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'exerciseT/add/:id',
    loadChildren: () => import('./pages/exercise/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'dictionary/index',
    loadChildren: () => import('./pages/dictionary/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'dictionary/add/:id',
    loadChildren: () => import('./pages/dictionary/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'dictionary/view/:id',
    loadChildren: () => import('./pages/dictionary/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'tests/view/:id',
    loadChildren: () => import('./pages/tests/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'tests/add/:id',
    loadChildren: () => import('./pages/tests/add/add.module').then( m => m.AddPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
