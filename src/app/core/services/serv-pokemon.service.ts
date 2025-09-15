import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Pokemon } from '@core/models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class ServPokemonService {

  constructor(private http: HttpClient) { }

  getPokemons(offset: number, limit: number = 9) {
    return this.http.get(`${env.pokeApi}pokemon/?offset=${offset}&limit=${limit}`);
  }

  getPokemonDetails(url: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(url);
  }

  getPokemonDetailsById(id: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${env.pokeApi}pokemon/${id}`);
  }

  getPokemonDetailsByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${env.pokeApi}/pokemon/${name.toLowerCase()}`);
  }

  getPokemonMoves(): Observable<any> {
    return this.http.get(`${env.pokeApi}/move?limit=10000`);
  }

  getPokemonTypes(): Observable<any> {
    return this.http.get(`${env.pokeApi}/type`);
  }


}
