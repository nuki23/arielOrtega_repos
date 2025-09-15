import { ComponentFixture, TestBed } from '@angular/core/testing';
import ListPokemonComponent from "./list-pokemon.component"
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe("list pokemon component", () => {
  let component: ListPokemonComponent
  let fixture: ComponentFixture<ListPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPokemonComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ListPokemonComponent)
    component = fixture.componentInstance
  })

  it('se debe crear un componente', () => {
    expect(component).toBeTruthy()
  })

  it('buscar el boton crear pokemon', () => {
    const dom = fixture.nativeElement as HTMLElement
    const buttonTexts = Array.from(dom.querySelectorAll('button'), button => button.innerText.trimStart().trimEnd());
    expect(buttonTexts).toContain('Crear pokemon')
  })

  it('deben haber 4 botones', () => {
    const dom = fixture.nativeElement as HTMLElement
    expect(dom.querySelectorAll('button').length).toEqual(4)
  })
})
