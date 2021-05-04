import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Sets a key and value in the storage
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // Retrieves a value from the storage
  public get(key: string) {
    return this._storage?.get(key);
  }
}
