import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SkillAttributesService {
    constructor(private http: HttpClient) {
    }

    getSkillAttributes() {
        return this.http.get('/assets/data/skillAttributes.json');
    }
}
