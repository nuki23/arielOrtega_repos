import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ServPokemonService } from '@core/services/serv-pokemon.service';
import { forkJoin } from 'rxjs';
import { Pokemon } from '@core/models/pokemon.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { saxDocumentUploadBold } from '@ng-icons/iconsax/bold';
import { NzUploadFile, NzUploadModule, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { provideIcons } from '@ng-icons/core';
import { NgIcon } from '@ng-icons/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-pokemon',
  imports: [
    CommonModule,
    NzGridModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzButtonModule,
    NzUploadModule,
    NgIcon
  ],
  templateUrl: './add-pokemon.component.html',
  styleUrl: './add-pokemon.component.scss',
  standalone: true,
  viewProviders: [provideIcons({
    saxDocumentUploadBold
  })]
})


export class AddPokemonComponent implements OnInit {
  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  pokemonMoves: any[] = [];
  pokemonTypes: any[] = [];
  pokemonImageBase64: string = '';
  formPoke: FormGroup;
  fileList: NzUploadFile[] = [];
  get name(): AbstractControl | null {
    return this.formPoke.get('name');
  }
  get hp(): AbstractControl | null {
    return this.formPoke.get('hp');
  }
  get ataque(): AbstractControl | null {
    return this.formPoke.get('ataque');
  }
  get defensa(): AbstractControl | null {
    return this.formPoke.get('defensa');
  }
  get espAtaque(): AbstractControl | null {
    return this.formPoke.get('espAtaque');
  }
  get espDefensa(): AbstractControl | null {
    return this.formPoke.get('espDefensa');
  }
  get velocidad(): AbstractControl | null {
    return this.formPoke.get('velocidad');
  }
  get altura(): AbstractControl | null {
    return this.formPoke.get('altura');
  }
  get peso(): AbstractControl | null {
    return this.formPoke.get('peso');
  }
  get movimiento(): AbstractControl | null {
    return this.formPoke.get('movimiento');
  }
  get tipo(): AbstractControl | null {
    return this.formPoke.get('tipo');
  }

  constructor(
    private modal: NzModalRef<any>,
    private fb: FormBuilder,
    private servPoke: ServPokemonService,
    private message: NzMessageService
  ) {
    this.formPoke = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      peso: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      altura: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      hp: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      ataque: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      defensa: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      espAtaque: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      espDefensa: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      velocidad: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(200)]],
      movimiento: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadMoveAndTypes();
  }

  loadMoveAndTypes(): void {
    forkJoin([
      this.servPoke.getPokemonTypes(),
      this.servPoke.getPokemonMoves()
    ]).subscribe({
      next: ([types, moves]) => {
        this.pokemonTypes = types.results;
        this.pokemonMoves = moves.results;
      },
      error: (error) => {
        // this.message.error('Error al cargar tipos y movimientos.');
        console.error('Error al cargar datos:', error);
      }
    });
  }
  handleUploadChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.fileList = info.fileList;
    } else if (info.file.status === 'error') {
      this.message.error('Error al subir la imagen.');
    } else if (info.file.status === 'removed') {
      this.fileList = [];
    }
  }



  confirm(): void {
    if (this.formPoke.invalid || !this.pokemonImageBase64) {
      this.formPoke.markAllAsTouched();
      if (!this.pokemonImageBase64) {
        this.message.error('Por favor, sube una imagen para el Pokémon.');
      } else {
        this.message.error('Por favor, completa todos los campos requeridos.');
      }
      return;
    }
    const uuidTruncate = uuidv4().slice(0,8)
    const newPokemon: Pokemon = {
      id: uuidTruncate,
      name: this.formPoke.value.name,
      height: this.formPoke.value.altura,
      weight: this.formPoke.value.peso,
      stats: [
        { base_stat: this.formPoke.value.hp, effort: 0, stat: { name: 'hp', url: '' } },
        { base_stat: this.formPoke.value.ataque, effort: 0, stat: { name: 'attack', url: '' } },
        { base_stat: this.formPoke.value.defensa, effort: 0, stat: { name: 'defense', url: '' } },
        { base_stat: this.formPoke.value.espAtaque, effort: 0, stat: { name: 'special-attack', url: '' } },
        { base_stat: this.formPoke.value.espDefensa, effort: 0, stat: { name: 'special-defense', url: '' } },
        { base_stat: this.formPoke.value.velocidad, effort: 0, stat: { name: 'speed', url: '' } },
      ],
      moves: this.formPoke.value.movimiento.map((moveName: string) => ({ move: { name: moveName, url: '' } })),
      types: this.formPoke.value.tipo.map((typeName: string) => ({ type: { name: typeName, url: '' } })),
      sprites: {
        front_default: this.pokemonImageBase64, // ⚠️ Asigna el Base64 a los sprites
      },
      isCustom: true,
    };
    const savedPokemons = JSON.parse(localStorage.getItem('customPokemons') || '[]');
    savedPokemons.push(newPokemon);
    localStorage.setItem('customPokemons', JSON.stringify(savedPokemons));
    this.modal.close(newPokemon);
  }

  cancel(): void {
    this.modal.close(false);
  }

  private getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      this.message.error('Solo se permiten archivos PNG y JPG.');
      return false;
    }
    this.getBase64(file as unknown as File).then(result => {
      this.pokemonImageBase64 = result as string;
    });
    return false;
  }


}
