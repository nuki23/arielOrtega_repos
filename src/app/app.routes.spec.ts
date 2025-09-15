import { TestBed } from '@angular/core/testing';
import { routes } from "./app.routes";

describe("rutas principales", () => {
  it("debe existir la ruta de lista de pokemones", () => {
    const pokemonRoute = routes.find(route => route.path === 'pokemons-list');
    expect(pokemonRoute).toBeTruthy();
    expect(pokemonRoute?.title).toEqual('Pokemons');
    expect(pokemonRoute?.loadChildren).toBeDefined();
  });

  it("debe existir la ruta para ver pokemon", () => {
    const pokemonRoute = routes.find(route => route.path === 'pokemon/:id/:custom');
    expect(pokemonRoute).toBeTruthy();
    expect(pokemonRoute?.title).toEqual('Pokemon');
    expect(pokemonRoute?.loadChildren).toBeDefined();
  });
});
