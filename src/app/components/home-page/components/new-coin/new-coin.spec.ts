import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { addCoin } from '../../../../actions/coin.actions';
import { NewCoin } from './new-coin';

interface NewCoinAccess {
  group: FormGroup;
  nameCtrl: FormControl<string>;
  descriptionCtrl: FormControl<string>;
  countryCtrl: FormControl<string>;
  yearCtrl: FormControl<number>;
  currencyValueCtrl: FormControl<number>;
  estimatedValueCtrl: FormControl<number>;
  submit(): void;
  allowOnlyDigits(event: KeyboardEvent, maxLength?: number): void;
  sanitizeDigits(event: Event, maxLength?: number): void;
};

describe('NewCoin', () => {
  let component: NewCoin;
  let fixture: ComponentFixture<NewCoin>;
  let store: { dispatch: jest.Mock };

  const page = () => component as unknown as NewCoinAccess;

  beforeEach(async () => {
    store = { dispatch: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [NewCoin],
      providers: [provideNoopAnimations(), { provide: Store, useValue: store }],
    }).compileComponents();
    fixture = TestBed.createComponent(NewCoin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidValues = () => {
    page().nameCtrl.setValue('Euro');
    page().descriptionCtrl.setValue('Commemorative coin');
    page().countryCtrl.setValue('Italy');
    page().yearCtrl.setValue(2002);
    page().currencyValueCtrl.setValue(2);
    page().estimatedValueCtrl.setValue(18);
  };

  it('initializes all form controls', () => {
    expect(['nameCtrl', 'descriptionCtrl', 'countryCtrl', 'yearCtrl', 'currencyValueCtrl', 'estimatedValueCtrl']
      .every((controlName) => page().group.contains(controlName))).toBe(true);
  });

  it.each(['nameCtrl', 'countryCtrl'] as const)(
    'rejects an empty required %s and does not dispatch',
    (controlName) => {
      setValidValues();
      page()[controlName].setValue('');
      page().submit();

      expect(page().group.invalid).toBe(true);
      expect(store.dispatch).not.toHaveBeenCalled();
    },
  );

  it.each([0, -1])('rejects year %i', (year) => {
    setValidValues();
    page().yearCtrl.setValue(year);
    expect(page().group.invalid).toBe(true);
  });

  it('accepts zero monetary values and an optional empty description', () => {
    setValidValues();
    page().descriptionCtrl.setValue('');
    page().currencyValueCtrl.setValue(0);
    page().estimatedValueCtrl.setValue(0);
    expect(page().group.valid).toBe(true);
  });

  it('dispatches a complete Coin for a valid form', () => {
    setValidValues();
    page().submit();
    expect(store.dispatch).toHaveBeenCalledWith(addCoin({ coin: expect.objectContaining({
      name: 'Euro', description: 'Commemorative coin', country: 'Italy', year: 2002,
      currencyValue: 2, estimatedValue: 18,
    }) }));
  });

  it.each(['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])(
    'allows control key %s',
    (key) => {
      const event = new KeyboardEvent('keydown', { key, cancelable: true });
      page().allowOnlyDigits(event);
      expect(event.defaultPrevented).toBe(false);
    },
  );

  it.each(['a', '-', '.'])('blocks non-digit key %s', (key) => {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    page().allowOnlyDigits(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('blocks a fifth year digit unless the existing input is selected', () => {
    const input = document.createElement('input');
    input.value = '2002';
    input.selectionStart = 4;
    input.selectionEnd = 4;
    const event = new KeyboardEvent('keydown', { key: '3', cancelable: true });
    Object.defineProperty(event, 'target', { value: input });
    page().allowOnlyDigits(event, 4);
    expect(event.defaultPrevented).toBe(true);

    input.selectionStart = 0;
    input.selectionEnd = 4;
    const replacement = new KeyboardEvent('keydown', { key: '3', cancelable: true });
    Object.defineProperty(replacement, 'target', { value: input });
    page().allowOnlyDigits(replacement, 4);
    expect(replacement.defaultPrevented).toBe(false);
  });

  it('sanitizes pasted input to digits and honours max length', () => {
    const input = document.createElement('input');
    input.value = '20a02-123';
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: input });
    page().sanitizeDigits(event, 4);
    expect(input.value).toBe('2002');
  });

  it('accepts the minimum valid year of one', () => {
    setValidValues();
    page().yearCtrl.setValue(1);
    expect(page().group.valid).toBe(true);
  });

  it.each(['currencyValueCtrl', 'estimatedValueCtrl'] as const)(
    'rejects a negative value in %s and does not dispatch',
    (controlName) => {
      setValidValues();
      page()[controlName].setValue(-1);
      page().submit();

      expect(page().group.invalid).toBe(true);
      expect(store.dispatch).not.toHaveBeenCalled();
    },
  );

  it('allows digit input with no maximum length', () => {
    const input = document.createElement('input');
    input.value = '123456789';
    input.selectionStart = input.value.length;
    input.selectionEnd = input.value.length;
    const event = new KeyboardEvent('keydown', { key: '3', cancelable: true });
    Object.defineProperty(event, 'target', { value: input });

    page().allowOnlyDigits(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('sanitizes non-digit input without truncating when no maximum length is given', () => {
    const input = document.createElement('input');
    input.value = '12a34-567';
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: input });

    page().sanitizeDigits(event);

    expect(input.value).toBe('1234567');
  });
});
