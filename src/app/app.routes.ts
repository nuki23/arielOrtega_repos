import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pokemons-list',
    title: 'Pokemons',
    loadChildren: () => import('./pages/list-pokemon/list-pokemon.routes').then(m => m.routes)
  },
  {
    path: 'pokemon/:id/:custom',
    title: 'Pokemon',
    loadChildren: () => import('./pages/detail-pokemon/detail-pokemon.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: '/pokemons-list',
  },
  {
    path: '',
    redirectTo: '/pokemons-list',
    pathMatch: 'full'
  }
];
