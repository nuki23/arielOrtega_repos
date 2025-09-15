import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { saxSearchNormal1Bold, saxArrowLeft3Bold, saxArrowRight2Bold, saxAddBold, saxAdditemBold, saxAddCircleBold } from '@ng-icons/iconsax/bold';
import { ServPokemonService } from '@core/services/serv-pokemon.service';
import { debounceTime, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Pokemon } from '@core/models/pokemon.interface';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddPokemonComponent } from '@shared/modal/add-pokemon/add-pokemon.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-list-pokemon',
  imports: [
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NgIcon,
    RouterModule,
    NzSelectModule,
    NzIconModule,
    ReactiveFormsModule,
    NzModalModule,
    NzRadioModule
  ],
  templateUrl: './list-pokemon.component.html',
  styleUrl: './list-pokemon.component.scss',
  standalone: true,
  viewProviders: [provideIcons({
    saxSearchNormal1Bold,
    saxArrowLeft3Bold,
    saxArrowRight2Bold,
    saxAddCircleBold
  })]
})
export default class ListPokemonComponent implements OnInit {
  loadArray = Array(12)
  listPoke: Pokemon[] = [];
  pokemonTypes: any[] = [];
  pokemonAbilities: any[] = [];
  offset = 0;
  limit = 12;
  isLoading = true;
  inputValue: string | null = null;
  formPoke: FormGroup;
  isFiltersLoading = true;
  filteredPokemonList: Pokemon[] = [];

  get name(): AbstractControl | null {
    return this.formPoke.get('name');
  }
  get verPokemons(): AbstractControl | any {
    return this.formPoke.get('verPokemons');
  }

  constructor(
    private servPoke: ServPokemonService,
    private fb: FormBuilder,
    private modalService: NzModalService
  ) {
    this.formPoke = this.fb.group({
      name: [null],
      verPokemons: ['2'],
    });
  }

  ngOnInit(): void {
    this.loadPokemons();
    this.formPoke
      .get('verPokemons')
      ?.valueChanges.pipe(
        debounceTime(10),
        tap((val) => {
          if (val == 1) {
            this.listPoke = this.getCustomPokemons();
          } else {
            this.loadPokemons()
          }
        })
      )
      .subscribe()
  }

  loadPokemons() {
    this.isLoading = true;
    this.servPoke.getPokemons(this.offset, this.limit).subscribe({
      next: (response: any) => {
        const detailRequests = response.results.map((pokemon: any) => {
          return this.servPoke.getPokemonDetails(pokemon.url);
        });
        forkJoin(detailRequests).subscribe((pokemonDetails: any) => {
          this.listPoke = pokemonDetails;
          this.isLoading = false;
        });
      },
      error: (error) => {
        console.error('Error al cargar Pokémon:', error);
        this.isLoading = false;
      }
    });

  }
  getCustomPokemons(): Pokemon[] {
    const customPokemonsJson = localStorage.getItem('customPokemons');
    return customPokemonsJson ? JSON.parse(customPokemonsJson) : [];
  }


  nextPage() {
    if (this.name?.value) {
      this.offset += this.limit;
      this.paginateFilteredResults();
    } else {
      this.offset += this.limit;
      this.loadPokemons();
    }
  }

  previousPage() {
    if (this.name?.value) {
      if (this.offset > 0) {
        this.offset -= this.limit;
        this.paginateFilteredResults();
      }
    } else {
      if (this.offset > 0) {
        this.offset -= this.limit;
        this.loadPokemons();
      }
    }
  }

  searchPoke(): void {
    const { name } = this.formPoke.value;
    this.isLoading = true;
    this.offset = 0;

    if (name) {
      this.servPoke.getPokemonDetailsByName(name).subscribe({
        next: (pokemon) => {
          this.filteredPokemonList = [pokemon];
          this.paginateFilteredResults();
        },
        error: (error) => {
          console.error('Pokémon no encontrado:', error);
          this.filteredPokemonList = [];
          this.paginateFilteredResults();
        }
      });
    } else {
      this.filteredPokemonList = [];
      this.loadPokemons();
    }
  }

  private paginateFilteredResults(): void {
    const start = this.offset;
    const end = start + this.limit;
    this.listPoke = this.filteredPokemonList.slice(start, end);
    this.isLoading = false;
  }

  showModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear pokemon',
      nzStyle: { top: '20px' },
      nzContent: AddPokemonComponent,
      nzFooter: null,
      nzWidth: 800,
      nzMaskClosable: false,
      nzData: {
        name: 'Carlos',
        age: 30,
      },
    });

    modal.afterClose.subscribe((result) => {
      if (this.verPokemons?.value == 1) {
        this.listPoke = this.getCustomPokemons();
      }
      console.log('Modal closed with result:', result);
      // 'result' will contain the data passed from the modal component (e.g., { success: true })
    });
  }



}
