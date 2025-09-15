import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { POKEMON_TYPE_COLORS } from '@core/constants/pokemon-types';
import { ServPokemonService } from '@core/services/serv-pokemon.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { saxArrowLeft3Bold, saxArrowRight2Bold } from '@ng-icons/iconsax/bold';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@Component({
  standalone: true,
  selector: 'app-detail-pokemon',
  imports: [
    CommonModule,
    NzButtonModule,
    NgIcon,
    NzProgressModule,
    RouterModule,
    NzSpinModule
  ],
  templateUrl: './detail-pokemon.component.html',
  styleUrl: './detail-pokemon.component.scss',
  viewProviders: [provideIcons({
    saxArrowLeft3Bold,
    saxArrowRight2Bold
  })]
})
export default class DetailPokemonComponent implements OnInit {
  pokemon: any;
  pokemonTypeColors = POKEMON_TYPE_COLORS;
  isLoading = true;
  constructor(
    private route: ActivatedRoute,
    private servPoke: ServPokemonService
  ) { }

  ngOnInit(): void {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    const custom = this.route.snapshot.paramMap.get('custom');

    if (pokemonId) {
      console.log(custom);

      if (custom == 'true') {
        const arrayCustomPokemon = this.getCustomPokemonById(pokemonId)
        console.log(arrayCustomPokemon);
        this.pokemon = arrayCustomPokemon;
        this.isLoading = false

      } else {
        this.getPokemonDetails(pokemonId);
      }
    }
  }

  getCustomPokemonById(pokemonId: string) {
    const storedPokemons = localStorage.getItem('customPokemons');
    if (storedPokemons) {
      try {
        const arrayCustomPokemon = JSON.parse(storedPokemons);
        const foundPokemon = arrayCustomPokemon.find(
          (pokemon: any) => pokemon.id === pokemonId
        );
        return foundPokemon || null;

      } catch (error) {
        console.error("Error al parsear el JSON de localStorage:", error);
        return null;
      }
    } else {
      return null;
    }
  }


    getPokemonDetails(id: string): void {
    this.isLoading = true;
    this.servPoke.getPokemonDetailsById(id).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokémon details:', error);
        this.isLoading = false;
      }
    });
  }



}
