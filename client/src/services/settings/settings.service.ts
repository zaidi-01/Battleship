import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";
import { singleton } from "tsyringe";

/**
 * Enum representing the keys for different settings.
 */
export enum SettingsKeys {
  Sound = "sound",
  Music = "music",
  Animations = "animations",
}

/**
 * Service class for managing game settings.
 */
@singleton()
export class SettingsService {
  private static SETTINGS_KEY = "settings";
  private static readonly defaultSettings: Record<SettingsKeys, any> = {
    [SettingsKeys.Sound]: true,
    [SettingsKeys.Music]: true,
    [SettingsKeys.Animations]: true,
  };

  private _settings: Record<SettingsKeys, any> =
    SettingsService.defaultSettings;
  private _settings$ = new BehaviorSubject(this._settings);

  /**
   * The current settings.
   */
  public get settings(): Record<SettingsKeys, any> {
    return this._settings;
  }

  /**
   * An observable of the current settings.
   */
  public get settings$(): Observable<Record<SettingsKeys, any>> {
    return this._settings$.asObservable();
  }

  /**
   * Initializes the SettingsService.
   */
  constructor() {
    this.loadSettings();
  }

  /**
   * Retrieves the value of a specific setting.
   * @param key The key of the setting.
   * @returns The value of the setting.
   */
  public getSetting(key: SettingsKeys): any {
    return this._settings[key];
  }

  /**
   * Retrieves the value of a specific setting as an observable.
   * @param key The key of the setting.
   * @returns The value of the setting as an observable.
   */
  public getSetting$(key: SettingsKeys): Observable<any> {
    return this.settings$.pipe(
      map((settings) => settings[key]),
      distinctUntilChanged()
    );
  }

  /**
   * Sets the value of a specific setting.
   * @param key   The key of the setting.
   * @param value The new value for the setting.
   */
  public setSetting(key: SettingsKeys, value: any): void {
    this._settings[key] = value;
    this._settings$.next(this._settings);

    this.saveSettings();
  }

  /**
   * Loads the settings from local storage.
   */
  private loadSettings(): void {
    const settings = localStorage.getItem(SettingsService.SETTINGS_KEY);
    try {
      if (settings) {
        this._settings = JSON.parse(settings);
        this._settings$.next(this._settings);
      }
    } catch (e) {
      console.error("Error loading settings", e);
    }
  }

  /**
   * Saves the settings to local storage.
   */
  private saveSettings(): void {
    localStorage.setItem(
      SettingsService.SETTINGS_KEY,
      JSON.stringify(this._settings)
    );
  }
}
