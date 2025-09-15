import { AddPokemonComponent } from '@shared/modal/add-pokemon/add-pokemon.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServPokemonService } from '@core/services/serv-pokemon.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

describe("formulario crear pokemon component", () => {
  let component: AddPokemonComponent
  let fixture: ComponentFixture<AddPokemonComponent>;
  let mockServPokemonService;
  let mockNzMessageService;
  let mockNzModalRef;
  let mockModalData;
  beforeEach(async () => {
    // se instancian los sevicios antes de crear el componente
    mockServPokemonService = jasmine.createSpyObj('ServPokemonService', ['someMethod', 'anotherMethod']);
    mockNzMessageService = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
    mockNzModalRef = jasmine.createSpyObj('NzModalRef', ['destroy']);
    mockModalData = {};

    await TestBed.configureTestingModule({
      imports: [
        AddPokemonComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: ServPokemonService, useValue: mockServPokemonService },
        { provide: NzMessageService, useValue: mockNzMessageService },
        { provide: NzModalRef, useValue: mockNzModalRef },
        { provide: NZ_MODAL_DATA, useValue: mockModalData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPokemonComponent);
    component = fixture.componentInstance;
  });

  it('debe existir el campo altura', () => {
    expect(component.formPoke.contains('altura')).toBeTruthy()
  })

  it('prueba que el campo altura sea obligatorio', () => {
    const altura:any = component.formPoke.get('altura')
    altura?.setValue(3)
    // altura?.setValue(null)
    expect(altura.valid).toBeTruthy()
  })

  it('evaluacion de exprecion regular campo altura', () => {
    const altura:any = component.formPoke.get('altura')
    altura?.setValue(10)
    expect(altura.hasError('pattern')).toBeFalse();
  })


})
