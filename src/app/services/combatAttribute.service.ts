import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CombatAttributeService {
    
    constructor(private http: HttpClient) {
    }

    getCombatAttributes() {
        return this.http.get('/assets/data/combatAttribute.json');
    }
}
