import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttributesService {
    
    constructor(private http: HttpClient) {
    }

    getAttributes() {
        return this.http.get('/assets/data/attributes.json');
    }
}
